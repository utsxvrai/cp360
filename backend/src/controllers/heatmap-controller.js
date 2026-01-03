const { StatusCodes } = require('http-status-codes');
const { HeatmapService } = require('../services');

const getHeatmap = async (req, res) => {
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

    const heatmapData = await HeatmapService.generateHeatmapData(userId, from, to);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Heatmap data retrieved successfully',
      error: {},
      data: heatmapData,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to get heatmap data',
      error: { message: error.message },
      data: {},
    });
  }
};

module.exports = {
  getHeatmap,
};

