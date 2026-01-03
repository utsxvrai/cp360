const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Logger, Supabase } = require('../config');
const { generateToken } = require('../utils/jwt');
const { ProfileRepository } = require('../repositories');
const CodeforcesService = require('./codeforces-service');

const signup = async (email, password, codeforcesHandle) => {
  try {
    // Validate Codeforces handle
    const isValidHandle = await CodeforcesService.validateHandle(codeforcesHandle);
    if (!isValidHandle) {
      throw new Error('Invalid Codeforces handle');
    }

    // Check if email already exists
    const { data: existingUser } = await Supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if handle is already taken
    const existingProfile = await ProfileRepository.getProfileByHandle(codeforcesHandle);
    if (existingProfile) {
      throw new Error('Codeforces handle already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = crypto.randomUUID();

    // Create user in users table
    const { error: userError } = await Supabase
      .from('users')
      .insert({
        id: userId,
        email,
        password_hash: hashedPassword,
      });

    if (userError) {
      throw new Error('Failed to create user account');
    }

    // Create profile
    const profile = await ProfileRepository.createProfile(userId, email, codeforcesHandle);

    // Generate JWT token
    const token = generateToken({
      id: profile.id,
      userId: profile.id,
      email: profile.email,
    });

    return {
      user: {
        id: profile.id,
        email: profile.email,
        codeforces_handle: profile.codeforces_handle,
      },
      token,
    };
  } catch (error) {
    Logger.error('Signup error', { error: error.message });
    throw error;
  }
};

const login = async (email, password) => {
  try {
    // Get user from users table
    const { data: user, error: userError } = await Supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Get profile
    const profile = await ProfileRepository.getProfileByUserId(user.id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Generate JWT token
    const token = generateToken({
      id: profile.id,
      userId: profile.id,
      email: profile.email,
    });

    return {
      user: {
        id: profile.id,
        email: profile.email,
        codeforces_handle: profile.codeforces_handle,
      },
      token,
    };
  } catch (error) {
    Logger.error('Login error', { error: error.message });
    throw error;
  }
};

module.exports = {
  signup,
  login,
};

