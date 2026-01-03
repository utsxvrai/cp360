const cron = require('node-cron');
const { Logger } = require('../config');
const { POTDService } = require('../services');

// Run daily at 00:00 UTC (midnight)
const schedule = '0 0 * * *';

const generateDailyPOTD = async () => {
  try {
    Logger.info('Starting daily POTD generation cron job');
    await POTDService.generateDailyPOTD();
    Logger.info('Daily POTD generation completed successfully');
  } catch (error) {
    Logger.error('Daily POTD generation cron job failed', {
      error: error.message,
      stack: error.stack,
    });
  }
};

const startCron = () => {
  Logger.info('Starting daily POTD cron job', { schedule });
  
  // Run immediately on startup (for testing/initial setup)
  generateDailyPOTD();
  
  // Schedule daily runs
  cron.schedule(schedule, generateDailyPOTD, {
    scheduled: true,
    timezone: 'UTC',
  });
};

module.exports = {
  startCron,
  generateDailyPOTD,
};

