// Date utility functions for week-based heatmap

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

const getWeekEnd = (date) => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const parseDate = (dateString) => {
  return new Date(dateString + 'T00:00:00');
};

const getDaysInRange = (startDate, endDate) => {
  const days = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    days.push(formatDate(new Date(current)));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

const groupDatesByWeek = (dates) => {
  const weeks = {};
  
  dates.forEach(dateStr => {
    const date = parseDate(dateStr);
    const weekStart = getWeekStart(date);
    const weekKey = formatDate(weekStart);
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    
    weeks[weekKey].push(dateStr);
  });
  
  // Sort dates within each week
  Object.keys(weeks).forEach(weekKey => {
    weeks[weekKey].sort();
  });
  
  return weeks;
};

module.exports = {
  getWeekStart,
  getWeekEnd,
  formatDate,
  parseDate,
  getDaysInRange,
  groupDatesByWeek,
};

