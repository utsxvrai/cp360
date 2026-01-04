const { Supabase, Logger } = require('../config');

const createDailyProblemSet = async (problemSet) => {
  try {
    const { data, error } = await Supabase
      .from('daily_problem_sets')
      .insert(problemSet)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.error('Create daily problem set error', { error: error.message });
    throw error;
  }
};

const getDailyProblemSetByDate = async (date) => {
  try {
    const { data, error } = await Supabase
      .from('daily_problem_sets')
      .select('*')
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    Logger.error('Get daily problem set error', { date, error: error.message });
    throw error;
  }
};

const getDailyProblemSetsInRange = async (fromDate, toDate) => {
  try {
    const { data, error } = await Supabase
      .from('daily_problem_sets')
      .select('*')
      .gte('date', fromDate)
      .lte('date', toDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    Logger.error('Get daily problem sets in range error', {
      fromDate,
      toDate,
      error: error.message,
    });
    throw error;
  }
};

const checkDailyProblemSetExists = async (date) => {
  try {
    const { data, error } = await Supabase
      .from('daily_problem_sets')
      .select('id')
      .eq('date', date)
      .single();

    return !error && data !== null;
  } catch (error) {
    return false;
  }
};

const getRecentDailyProblemSets = async (limit = 10) => {
  try {
    const { data, error } = await Supabase
      .from('daily_problem_sets')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    Logger.error('Get recent daily problem sets error', {
      limit,
      error: error.message,
    });
    throw error;
  }
};

const getAllUsedProblemKeys = async () => {
  try {
    const { data, error } = await Supabase
      .from('daily_problem_sets')
      .select('easy_contest_id, easy_index, medium_contest_id, medium_index, hard_contest_id, hard_index');

    if (error) throw error;

    const usedKeys = new Set();
    data.forEach(row => {
      usedKeys.add(`${row.easy_contest_id}-${row.easy_index}`);
      usedKeys.add(`${row.medium_contest_id}-${row.medium_index}`);
      usedKeys.add(`${row.hard_contest_id}-${row.hard_index}`);
    });

    return usedKeys;
  } catch (error) {
    Logger.error('Get all used problem keys error', { error: error.message });
    return new Set();
  }
};

module.exports = {
  createDailyProblemSet,
  getDailyProblemSetByDate,
  getDailyProblemSetsInRange,
  getRecentDailyProblemSets,
  checkDailyProblemSetExists,
  getAllUsedProblemKeys,
};

