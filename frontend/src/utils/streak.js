/**
 * Calculate streak from progress data
 * A day counts if at least ONE problem (Easy OR Medium OR Hard) is solved
 */

export const calculateStreak = (progressData) => {
  if (!progressData || progressData.length === 0) {
    return { current: 0, isActiveToday: false };
  }

  // Sort by date (most recent first)
  const sorted = [...progressData].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let isActiveToday = false;

  // Check today first
  const todayData = sorted.find(p => p.date === today);
  if (todayData) {
    const solvedToday = todayData.easy || todayData.medium || todayData.hard;
    isActiveToday = solvedToday;
    
    if (solvedToday) {
      streak = 1;
    } else {
      return { current: 0, isActiveToday: false };
    }
  } else {
    // No data for today, check if yesterday was solved
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayData = sorted.find(p => p.date === yesterdayStr);
    
    if (!yesterdayData || !(yesterdayData.easy || yesterdayData.medium || yesterdayData.hard)) {
      return { current: 0, isActiveToday: false };
    }
  }

  // Count consecutive days backwards from today
  let checkDate = new Date();
  if (!todayData) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let i = 0; i < sorted.length; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayData = sorted.find(p => p.date === dateStr);
    
    if (!dayData) {
      break;
    }

    const solved = dayData.easy || dayData.medium || dayData.hard;
    
    if (solved) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { current: streak, isActiveToday };
};

export const formatStreak = (streak) => {
  return String(streak).padStart(2, '0');
};

