import { memo } from 'react';
import HeatmapCell from './HeatmapCell';

const HeatmapDate = memo(({ date, easy, medium, hard }) => {
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-32 text-sm text-retro-text uppercase font-bold">
        {formattedDate}
      </div>
      <div className="flex items-center gap-2">
        <HeatmapCell solved={easy} difficulty="easy" date={date} />
        <HeatmapCell solved={medium} difficulty="medium" date={date} />
        <HeatmapCell solved={hard} difficulty="hard" date={date} />
      </div>
    </div>
  );
});

HeatmapDate.displayName = 'HeatmapDate';

export default HeatmapDate;

