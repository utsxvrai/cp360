const { StatusCodes } = require('http-status-codes');
const { ProgressService } = require('../services');

const getProgressForDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.userId || req.user.id;

    if (!date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date parameter is required',
        error: {},
        data: {},
      });
    }

    const progress = await ProgressService.computeProgressForDate(userId, date);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Progress retrieved successfully',
      error: {},
      data: progress,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get progress',
      error: { message: error.message },
      data: {},
    });
  }
};

const getProgressForRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    const userId = req.user.userId || req.user.id;

    if (!from || !to) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'from and to query parameters are required',
        error: {},
        data: {},
      });
    }

    const progress = await ProgressService.computeProgressForDateRange(userId, from, to);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Progress retrieved successfully',
      error: {},
      data: progress,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get progress',
      error: { message: error.message },
      data: {},
    });
  }
};

const syncProgress = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { date } = req.body; // Optional: specific date, defaults to today

    // Clear cache for user submissions to force fresh fetch
    const progress = await ProgressService.syncAndComputeProgress(userId, date);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Progress synced successfully',
      error: {},
      data: progress,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to sync progress',
      error: { message: error.message },
      data: {},
    });
  }
};

module.exports = {
  getProgressForDate,
  getProgressForRange,
  syncProgress,
};
