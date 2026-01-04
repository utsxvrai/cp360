const { StatusCodes } = require('http-status-codes');
const { POTDService } = require('../services');
const { DailyProblemRepository } = require('../repositories');
const { formatDate } = require('../utils/date-helpers');

const getTodayPOTD = async (req, res) => {
  try {
    const today = formatDate(new Date());
    let problemSet = await DailyProblemRepository.getDailyProblemSetByDate(today);

    // If no POTD exists for today, generate it
    if (!problemSet) {
      problemSet = await POTDService.generateDailyPOTD(today);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'POTD retrieved successfully',
      error: {},
      data: problemSet,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get POTD',
      error: { message: error.message },
      data: {},
    });
  }
};

const getPOTDByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    if (!date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Date parameter is required',
        error: {},
        data: {},
      });
    }

    let problemSet = await DailyProblemRepository.getDailyProblemSetByDate(date);

    // If no POTD exists, generate it
    if (!problemSet) {
      problemSet = await POTDService.generateDailyPOTD(date);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'POTD retrieved successfully',
      error: {},
      data: problemSet,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get POTD',
      error: { message: error.message },
      data: {},
    });
  }
};

const generatePOTD = async (req, res) => {
  try {
    const { date } = req.body;
    const targetDate = date || formatDate(new Date());

    const problemSet = await POTDService.generateDailyPOTD(targetDate);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'POTD generated successfully',
      error: {},
      data: problemSet,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to generate POTD',
      error: { message: error.message },
      data: {},
    });
  }
};

const getPastPOTDs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const problemSets = await DailyProblemRepository.getRecentDailyProblemSets(limit);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Past POTDs retrieved successfully',
      error: {},
      data: problemSets,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get past POTDs',
      error: { message: error.message },
      data: [],
    });
  }
};

module.exports = {
  getTodayPOTD,
  getPOTDByDate,
  getPastPOTDs,
  generatePOTD,
};

