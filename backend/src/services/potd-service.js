const { Logger } = require('../config');
const CodeforcesService = require('./codeforces-service');
const { DailyProblemRepository } = require('../repositories');
const { formatDate } = require('../utils/date-helpers');

// Algorithm: From each contest, select one Easy, one Medium, one Hard
// Algorithm: From each contest, select one Easy, one Medium, one Hard
const selectProblemsFromContests = (contests, problemsByContest, usedProblems) => {
  let easyProblem = null;
  let mediumProblem = null;
  let hardProblem = null;

  const isUsedProblem = (contestId, index) => {
    return usedProblems.has(`${contestId}-${index}`);
  };

  for (const contest of contests) {
    const problems = problemsByContest[contest.id] || [];

    for (const problem of problems) {
      const rating = problem.rating || 0;

      // Easy: 800–1000
      if (
        !easyProblem &&
        rating >= 800 &&
        rating <= 1000 &&
        !isUsedProblem(contest.id, problem.index)
      ) {
        easyProblem = {
          contestId: contest.id,
          index: problem.index,
          rating,
          name: problem.name,
        };
      }

      // Medium: 1100–1400
      if (
        !mediumProblem &&
        rating >= 1100 &&
        rating <= 1400 &&
        !isUsedProblem(contest.id, problem.index)
      ) {
        mediumProblem = {
          contestId: contest.id,
          index: problem.index,
          rating,
          name: problem.name,
        };
      }

      // Hard: 1500–1599
      if (
        !hardProblem &&
        rating >= 1500 &&
        rating < 1600 &&
        !isUsedProblem(contest.id, problem.index)
      ) {
        hardProblem = {
          contestId: contest.id,
          index: problem.index,
          rating,
          name: problem.name,
        };
      }

      if (easyProblem && mediumProblem && hardProblem) break;
    }

    if (easyProblem && mediumProblem && hardProblem) break;
  }

  return { easyProblem, mediumProblem, hardProblem };
};


// Keep track of active generations to prevent duplicates
const activeGenerations = new Map();

const generateDailyPOTD = async (date = null) => {
  const targetDate = date || formatDate(new Date());

  if (activeGenerations.has(targetDate)) {
    Logger.info('POTD generation already in progress, waiting...', { date: targetDate });
    return activeGenerations.get(targetDate);
  }

  let resolveGen, rejectGen;
  const promise = new Promise((res, rej) => {
    resolveGen = res;
    rejectGen = rej;
  });

  activeGenerations.set(targetDate, promise);

  (async () => {
    try {
      const exists = await DailyProblemRepository.checkDailyProblemSetExists(targetDate);
      if (exists) {
        const data = await DailyProblemRepository.getDailyProblemSetByDate(targetDate);
        resolveGen(data);
        return;
      }

      Logger.info('Generating daily POTD', { date: targetDate });

      // ✅ FIX: fetch last 100 contests
      const contests = await CodeforcesService.getRecentContests(100);
      if (!contests.length) {
        throw new Error('No recent contests found');
      }

      // ✅ FIX: fetch already-used problems
      const usedProblems = await DailyProblemRepository.getAllUsedProblemKeys();
      // expected: Set { "1921-A", "1921-C", ... }

      const problemsByContest = {};

      for (const contest of contests) {
        try {
          const problems = await CodeforcesService.getContestProblems(contest.id);
          if (problems?.length) {
            problemsByContest[contest.id] = problems;
          }

          const { easyProblem, mediumProblem, hardProblem } =
            selectProblemsFromContests(contests, problemsByContest, usedProblems);

          if (easyProblem && mediumProblem && hardProblem) break;
        } catch (error) {
          Logger.warn('Failed to fetch problems for contest', {
            contestId: contest.id,
            error: error.message,
          });
        }
      }

      const { easyProblem, mediumProblem, hardProblem } =
        selectProblemsFromContests(contests, problemsByContest, usedProblems);

      if (!easyProblem || !mediumProblem || !hardProblem) {
        throw new Error('Exhausted problem pool in last 100 contests');
      }

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
      Logger.error('Generate daily POTD worker failed', {
        date: targetDate,
        error: error.message,
        stack: error.stack,
      });
      rejectGen(error);
    } finally {
      activeGenerations.delete(targetDate);
    }
  })();

  return promise;
};


module.exports = {
  generateDailyPOTD,
};

