import { memo } from 'react';
import HeatmapCell from './HeatmapCell';

const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const HeatmapDay = memo(({ date, easy, medium, hard, dayIndex }) => {
  const dayName = dayNames[dayIndex % 7];
  const dateObj = new Date(date + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0

  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="w-12 text-xs text-retro-muted uppercase text-right">
        {dayName}
      </div>
      <HeatmapCell solved={easy} difficulty="easy" date={date} />
      <HeatmapCell solved={medium} difficulty="medium" date={date} />
      <HeatmapCell solved={hard} difficulty="hard" date={date} />
    </div>
  );
});

HeatmapDay.displayName = 'HeatmapDay';

export default HeatmapDay;

