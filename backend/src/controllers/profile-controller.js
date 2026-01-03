const { StatusCodes } = require('http-status-codes');
const { ProfileRepository } = require('../repositories');
const { CodeforcesService } = require('../services');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const profile = await ProfileRepository.getProfileByUserId(userId);

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Profile not found',
        error: {},
        data: {},
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile retrieved successfully',
      error: {},
      data: profile,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get profile',
      error: { message: error.message },
      data: {},
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { codeforces_handle } = req.body;

    if (codeforces_handle) {
      // Validate handle
      const isValidHandle = await CodeforcesService.validateHandle(codeforces_handle);
      if (!isValidHandle) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid Codeforces handle',
          error: {},
          data: {},
        });
      }

      // Check if handle is already taken by another user
      const existingProfile = await ProfileRepository.getProfileByHandle(codeforces_handle);
      if (existingProfile && existingProfile.id !== userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Codeforces handle already registered',
          error: {},
          data: {},
        });
      }
    }

    const updatedProfile = await ProfileRepository.updateProfile(userId, req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully',
      error: {},
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update profile',
      error: { message: error.message },
      data: {},
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

