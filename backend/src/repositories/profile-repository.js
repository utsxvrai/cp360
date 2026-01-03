const { Supabase, Logger } = require('../config');

const createProfile = async (userId, email, codeforcesHandle) => {
  try {
    const { data, error } = await Supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        codeforces_handle: codeforcesHandle,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.error('Create profile error', { error: error.message });
    throw error;
  }
};

const getProfileByUserId = async (userId) => {
  try {
    const { data, error } = await Supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    Logger.error('Get profile error', { userId, error: error.message });
    throw error;
  }
};

const getProfileByHandle = async (handle) => {
  try {
    const { data, error } = await Supabase
      .from('profiles')
      .select('*')
      .eq('codeforces_handle', handle)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    Logger.error('Get profile by handle error', { handle, error: error.message });
    throw error;
  }
};

const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await Supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.error('Update profile error', { userId, error: error.message });
    throw error;
  }
};

module.exports = {
  createProfile,
  getProfileByUserId,
  getProfileByHandle,
  updateProfile,
};

