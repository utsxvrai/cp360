const { Logger } = require('../config');
const CodeforcesService = require('./codeforces-service');
const { DailyProblemRepository } = require('../repositories');
const { formatDate } = require('../utils/date-helpers');

// Algorithm: From each contest, select one Easy, one Medium, one Hard
const selectProblemsFromContests = (contests, problemsByContest) => {
  let easyProblem = null;
  let mediumProblem = null;
  let hardProblem = null;

  // Iterate through contests to find problems
  for (const contest of contests) {
    const problems = problemsByContest[contest.id] || [];
    
    for (const problem of problems) {
      const rating = problem.rating || 0;
      
      // Easy: 800-1000
      if (!easyProblem && rating >= 800 && rating <= 1000) {
        easyProblem = {
          contestId: contest.id,
          index: problem.index,
          rating: rating,
          name: problem.name,
        };
      }
      
      // Medium: 1100-1400
      if (!mediumProblem && rating >= 1100 && rating <= 1400) {
        mediumProblem = {
          contestId: contest.id,
          index: problem.index,
          rating: rating,
          name: problem.name,
        };
      }
      
      // Hard: 1500-1600 (as per requirement: under 1600)
      if (!hardProblem && rating >= 1500 && rating < 1600) {
        hardProblem = {
          contestId: contest.id,
          index: problem.index,
          rating: rating,
          name: problem.name,
        };
      }
      
      // If we found all three, we can stop
      if (easyProblem && mediumProblem && hardProblem) {
        break;
      }
    }
    
    if (easyProblem && mediumProblem && hardProblem) {
      break;
    }
  }

  return { easyProblem, mediumProblem, hardProblem };
};

// Keep track of active generations to prevent duplicates
const activeGenerations = new Map();

const generateDailyPOTD = async (date = null) => {
  const targetDate = date || formatDate(new Date());

  // If a generation is already in progress for this date, wait for it
  if (activeGenerations.has(targetDate)) {
    Logger.info('POTD generation already in progress, waiting...', { date: targetDate });
    return activeGenerations.get(targetDate);
  }

  // Placeholder to be resolved/rejected by the worker
  let resolveGen, rejectGen;
  const promise = new Promise((res, rej) => {
    resolveGen = res;
    rejectGen = rej;
  });

  activeGenerations.set(targetDate, promise);

  // Start the actual generation worker
  (async () => {
    try {
      // Check if POTD already exists for this date
      const exists = await DailyProblemRepository.checkDailyProblemSetExists(targetDate);
      if (exists) {
        Logger.info('POTD already exists for date (checked by worker)', { date: targetDate });
        const data = await DailyProblemRepository.getDailyProblemSetByDate(targetDate);
        resolveGen(data);
        return;
      }

      Logger.info('Generating daily POTD', { date: targetDate });

      // Get recent contests - use 50 to ensure we find diverse problems
      const contests = await CodeforcesService.getRecentContests(50);
      if (contests.length === 0) {
        throw new Error('No recent contests found from Codeforces API');
      }

      // Fetch problems for each contest
      const problemsByContest = {};
      for (const contest of contests) {
        try {
          const problems = await CodeforcesService.getContestProblems(contest.id);
          if (problems && problems.length > 0) {
            problemsByContest[contest.id] = problems;
          }
          
          // Early exit check
          const { easyProblem, mediumProblem, hardProblem } = selectProblemsFromContests(
            contests,
            problemsByContest
          );
          if (easyProblem && mediumProblem && hardProblem) {
            Logger.info('Found all required problems early', { date: targetDate, contestCount: Object.keys(problemsByContest).length });
            break;
          }
        } catch (error) {
          Logger.warn('Failed to fetch problems for contest', {
            contestId: contest.id,
            error: error.message,
          });
        }
      }

      // Final problem matching check
      const { easyProblem, mediumProblem, hardProblem } = selectProblemsFromContests(
        contests,
        problemsByContest
      );

      if (!easyProblem || !mediumProblem || !hardProblem) {
        throw new Error(`Could not find problems for all difficulty levels after scanning ${Object.keys(problemsByContest).length} contests`);
      }

      // Create daily problem set
      const problemSet = {
        date: targetDate,
        easy_contest_id: easyProblem.contestId,
        easy_index: easyProblem.index,
        easy_rating: easyProblem.rating,
        medium_contest_id: mediumProblem.contestId,
        medium_index: mediumProblem.index,
        medium_rating: mediumProblem.rating,
        hard_contest_id: hardProblem.contestId,
        hard_index: hardProblem.index,
        hard_rating: hardProblem.rating,
      };

      const result = await DailyProblemRepository.createDailyProblemSet(problemSet);
      Logger.info('Daily POTD generated successfully', { date: targetDate });
      
      resolveGen(result);
    } catch (error) {
      Logger.error('Generate daily POTD worker failed', { date: targetDate, error: error.message, stack: error.stack });
      rejectGen(error);
    } finally {
      // Clean up the lock
      activeGenerations.delete(targetDate);
    }
  })();

  return promise;
};

module.exports = {
  generateDailyPOTD,
};

