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

module.exports = {
  createDailyProblemSet,
  getDailyProblemSetByDate,
  getDailyProblemSetsInRange,
  checkDailyProblemSetExists,
};

