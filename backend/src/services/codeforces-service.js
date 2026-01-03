const axios = require('axios');
const { Logger } = require('../config');
const cache = require('../utils/cache');

const CODEFORCES_API_BASE = 'https://codeforces.com/api';

// Rate limiting: Codeforces allows 1 request per 2 seconds
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (endpoint, params = {}, forceRefresh = false) => {
  const cacheKey = `cf:${endpoint}:${JSON.stringify(params)}`;
  
  // If force refresh, clear cache first
  if (forceRefresh) {
    cache.delete(cacheKey);
  } else {
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Rate limiting
  const now = Date.now();
  const waitTime = Math.max(0, lastRequestTime + MIN_REQUEST_INTERVAL - now);
  lastRequestTime = now + waitTime;

  if (waitTime > 0) {
    await delay(waitTime);
  }

  try {
    const url = `${CODEFORCES_API_BASE}/${endpoint}`;
    const response = await axios.get(url, { params, timeout: 10000 });
    
    if (response.data.status === 'OK') {
      // Cache successful responses for 5 minutes
      cache.set(cacheKey, response.data.result, 300);
      lastRequestTime = Date.now();
      return response.data.result;
    } else {
      throw new Error(response.data.comment || 'Codeforces API error');
    }
  } catch (error) {
    Logger.error('Codeforces API error', { endpoint, error: error.message });
    throw error;
  }
};

const validateHandle = async (handle) => {
  try {
    const users = await makeRequest('user.info', { handles: handle });
    return users && users.length > 0 && users[0].handle === handle;
  } catch (error) {
    Logger.error('Handle validation error', { handle, error: error.message });
    return false;
  }
};

const getUserSubmissions = async (handle, from = 1, count = 1000, forceRefresh = false) => {
  try {
    const submissions = await makeRequest('user.status', {
      handle,
      from,
      count,
    }, forceRefresh);
    return submissions || [];
  } catch (error) {
    Logger.error('Get submissions error', { handle, error: error.message });
    return [];
  }
};

const clearUserCache = (handle) => {
  // Clear all cache entries related to this user
  // Clear user.status cache (various parameter combinations)
  const statusPattern = `cf:user.status:`;
  const infoPattern = `cf:user.info:`;
  
  let clearedCount = 0;
  
  // Clear all user.status entries that contain this handle
  clearedCount += cache.deletePattern(statusPattern);
  
  // Clear user.info entries
  clearedCount += cache.deletePattern(infoPattern);
  
  Logger.info('Cache cleared for user', { handle, clearedCount });
};

const getRecentContests = async (count = 100) => {
  try {
    const contests = await makeRequest('contest.list', { gym: false });
    // Filter recent contests (last 6 months)
    const sixMonthsAgo = Math.floor(Date.now() / 1000) - (6 * 30 * 24 * 60 * 60);
    const recent = contests
      .filter(c => c.startTimeSeconds >= sixMonthsAgo && c.phase === 'FINISHED')
      .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
      .slice(0, count);
    return recent;
  } catch (error) {
    Logger.error('Get contests error', { error: error.message });
    return [];
  }
};

const getContestProblems = async (contestId) => {
  try {
    const problems = await makeRequest('contest.standings', {
      contestId,
      from: 1,
      count: 1,
      showUnofficial: false,
    });
    return problems?.problems || [];
  } catch (error) {
    Logger.error('Get contest problems error', { contestId, error: error.message });
    return [];
  }
};

const checkProblemSolved = async (handle, contestId, problemIndex) => {
  try {
    const submissions = await getUserSubmissions(handle, 1, 1000);
    return submissions.some(
      sub =>
        sub.contestId === contestId &&
        sub.problem.index === problemIndex &&
        sub.verdict === 'OK'
    );
  } catch (error) {
    Logger.error('Check problem solved error', {
      handle,
      contestId,
      problemIndex,
      error: error.message,
    });
    return false;
  }
};

module.exports = {
  validateHandle,
  getUserSubmissions,
  getRecentContests,
  getContestProblems,
  checkProblemSolved,
  makeRequest,
  clearUserCache,
};

