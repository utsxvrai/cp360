const { Logger } = require('../config');
const ProgressService = require('./progress-service');
const POTDService = require('./potd-service');
const { DailyProblemRepository } = require('../repositories');
const { groupDatesByWeek, getDaysInRange, formatDate } = require('../utils/date-helpers');

const generateHeatmapData = async (userId, fromDate, toDate, forceRefresh = false) => {
  try {
    // Ensure today's POTD exists if it's within the range
    const today = formatDate(new Date());
    if (toDate >= today && fromDate <= today) {
      const exists = await DailyProblemRepository.checkDailyProblemSetExists(today);
      if (!exists) {
        try {
          await POTDService.generateDailyPOTD(today);
        } catch (potdError) {
          Logger.warn('Auto-generation of POTD for heatmap failed', { date: today, error: potdError.message });
        }
      }
    }

    // Compute progress for all dates in range
    const progress = await ProgressService.computeProgressForDateRange(
      userId,
      fromDate,
      toDate,
      forceRefresh
    );

    // Create a map for quick lookup
    const progressMap = {};
    progress.forEach(item => {
      progressMap[item.date] = item;
    });

    // Get all dates in range
    const allDates = getDaysInRange(fromDate, toDate);

    // Group dates by week
    const weeks = groupDatesByWeek(allDates);

    // Structure data by week
    const heatmapData = {};
    let weekIndex = 1;

    // Sort weeks by date
    const sortedWeekKeys = Object.keys(weeks).sort();

    sortedWeekKeys.forEach(weekKey => {
      const weekDates = weeks[weekKey];
      
      // Ensure we have 7 days (Monday to Sunday)
      const weekData = [];
      
      // Create a date object for the week start
      const weekStart = new Date(weekKey + 'T00:00:00');
      
      // Generate 7 days starting from Monday
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = formatDate(currentDate);
        
        const progressItem = progressMap[dateStr] || {
          date: dateStr,
          easy: false,
          medium: false,
          hard: false,
        };
        
        weekData.push(progressItem);
      }

      heatmapData[`week_${weekIndex}`] = weekData;
      weekIndex++;
    });

    return heatmapData;
  } catch (error) {
    Logger.error('Generate heatmap data error', {
      userId,
      fromDate,
      toDate,
      error: error.message,
    });
    throw error;
  }
};

module.exports = {
  generateHeatmapData,
};

