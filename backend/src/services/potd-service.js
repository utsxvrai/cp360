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

const generateDailyPOTD = async (date = null) => {
  try {
    const targetDate = date || formatDate(new Date());
    
    // Check if POTD already exists for this date
    const exists = await DailyProblemRepository.checkDailyProblemSetExists(targetDate);
    if (exists) {
      Logger.info('POTD already exists for date', { date: targetDate });
      return await DailyProblemRepository.getDailyProblemSetByDate(targetDate);
    }

    Logger.info('Generating daily POTD', { date: targetDate });

    // Get recent contests
    const contests = await CodeforcesService.getRecentContests(50);
    if (contests.length === 0) {
      throw new Error('No recent contests found');
    }

    // Fetch problems for each contest
    const problemsByContest = {};
    for (const contest of contests) {
      try {
        const problems = await CodeforcesService.getContestProblems(contest.id);
        if (problems && problems.length > 0) {
          problemsByContest[contest.id] = problems;
        }
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        Logger.warn('Failed to fetch problems for contest', {
          contestId: contest.id,
          error: error.message,
        });
      }
    }

    // Select problems using the algorithm
    const { easyProblem, mediumProblem, hardProblem } = selectProblemsFromContests(
      contests,
      problemsByContest
    );

    if (!easyProblem || !mediumProblem || !hardProblem) {
      throw new Error('Could not find problems for all difficulty levels');
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
    
    return result;
  } catch (error) {
    Logger.error('Generate daily POTD error', { error: error.message });
    throw error;
  }
};

module.exports = {
  generateDailyPOTD,
};

