import { memo } from 'react';
import HeatmapDay from './HeatmapDay';

const HeatmapWeek = memo(({ weekData, weekNumber }) => {
  // Ensure we have exactly 7 days (Monday to Sunday)
  const weekStart = new Date(weekData[0]?.date + 'T00:00:00');
  const dayOfWeek = weekStart.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Create full week array
  const fullWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() - mondayOffset + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayData = weekData.find(d => d.date === dateStr) || {
      date: dateStr,
      easy: false,
      medium: false,
      hard: false,
    };
    
    fullWeek.push(dayData);
  }

  return (
    <div className="mb-8 animate-fade-in" style={{ animationDelay: `${weekNumber * 0.1}s` }}>
      <div className="text-sm text-retro-muted uppercase tracking-wider mb-4">
        WEEK {weekNumber}
      </div>
      <div className="space-y-1">
        {fullWeek.map((day, index) => (
          <HeatmapDay
            key={day.date}
            date={day.date}
            easy={day.easy}
            medium={day.medium}
            hard={day.hard}
            dayIndex={index}
          />
        ))}
      </div>
    </div>
  );
});

HeatmapWeek.displayName = 'HeatmapWeek';

export default HeatmapWeek;

