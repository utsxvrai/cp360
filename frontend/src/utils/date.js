export const formatDate = (date) => {
  if (typeof date === 'string') {
    return date;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDateRange = (weeks = 8) => {
  const today = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (weeks * 7));
  
  return {
    from: formatDate(from),
    to: formatDate(today),
  };
};

export const getDaysInRange = (from, to) => {
  const days = [];
  const current = new Date(from);
  const end = new Date(to);
  
  while (current <= end) {
    days.push(formatDate(new Date(current)));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const groupDatesByWeek = (dates) => {
  const weeks = {};
  
  dates.forEach(dateStr => {
    const date = new Date(dateStr + 'T00:00:00');
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

