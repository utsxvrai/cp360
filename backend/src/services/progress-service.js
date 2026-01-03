const { Logger } = require('../config');
const CodeforcesService = require('./codeforces-service');
const { DailyProblemRepository } = require('../repositories');
const { ProfileRepository } = require('../repositories');

const computeProgressForDate = async (userId, date, forceRefresh = false) => {
  try {
    const profile = await ProfileRepository.getProfileByUserId(userId);
    if (!profile || !profile.codeforces_handle) {
      throw new Error('User profile or Codeforces handle not found');
    }

    const problemSet = await DailyProblemRepository.getDailyProblemSetByDate(date);
    if (!problemSet) {
      return {
        date,
        easy: false,
        medium: false,
        hard: false,
      };
    }

    const handle = profile.codeforces_handle;

    // If force refresh, clear cache first
    if (forceRefresh) {
      CodeforcesService.clearUserCache(handle);
    }

    // Check each problem in parallel
    const [easySolved, mediumSolved, hardSolved] = await Promise.all([
      CodeforcesService.checkProblemSolved(
        handle,
        problemSet.easy_contest_id,
        problemSet.easy_index
      ),
      CodeforcesService.checkProblemSolved(
        handle,
        problemSet.medium_contest_id,
        problemSet.medium_index
      ),
      CodeforcesService.checkProblemSolved(
        handle,
        problemSet.hard_contest_id,
        problemSet.hard_index
      ),
    ]);

    return {
      date,
      easy: easySolved,
      medium: mediumSolved,
      hard: hardSolved,
    };
  } catch (error) {
    Logger.error('Compute progress error', { userId, date, error: error.message });
    throw error;
  }
};

const computeProgressForDateRange = async (userId, fromDate, toDate, forceRefresh = false) => {
  try {
    const problemSets = await DailyProblemRepository.getDailyProblemSetsInRange(
      fromDate,
      toDate
    );

    if (problemSets.length === 0) {
      return [];
    }

    const profile = await ProfileRepository.getProfileByUserId(userId);
    if (!profile || !profile.codeforces_handle) {
      throw new Error('User profile or Codeforces handle not found');
    }

    const handle = profile.codeforces_handle;

    // Fetch user submissions (with optional cache clearing)
    const submissions = await CodeforcesService.getUserSubmissions(handle, 1, 10000, forceRefresh);
    const solvedProblems = new Set();
    
    submissions
      .filter(sub => sub.verdict === 'OK')
      .forEach(sub => {
        const key = `${sub.contestId}-${sub.problem.index}`;
        solvedProblems.add(key);
      });

    // Compute progress for each date
    const progress = problemSets.map(problemSet => {
      const easyKey = `${problemSet.easy_contest_id}-${problemSet.easy_index}`;
      const mediumKey = `${problemSet.medium_contest_id}-${problemSet.medium_index}`;
      const hardKey = `${problemSet.hard_contest_id}-${problemSet.hard_index}`;

      return {
        date: problemSet.date,
        easy: solvedProblems.has(easyKey),
        medium: solvedProblems.has(mediumKey),
        hard: solvedProblems.has(hardKey),
      };
    });

    return progress;
  } catch (error) {
    Logger.error('Compute progress for range error', {
      userId,
      fromDate,
      toDate,
      error: error.message,
    });
    throw error;
  }
};

const syncAndComputeProgress = async (userId, date = null) => {
  try {
    const targetDate = date || formatDate(new Date());
    
    // Recompute progress with force refresh
    const progress = await computeProgressForDate(userId, targetDate, true);
    
    return progress;
  } catch (error) {
    Logger.error('Sync progress error', { userId, date, error: error.message });
    throw error;
  }
};

module.exports = {
  computeProgressForDate,
  computeProgressForDateRange,
  syncAndComputeProgress,
};

