'use client';

import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthViewProps {
  date: Date;
}

export function MonthView({ date }: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let currentDay = calendarStart;

  while (currentDay <= calendarEnd) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return (
    <div className="grid grid-cols-7 divide-x divide-y">
      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
        <div
          key={day}
          className="sticky top-0 bg-background p-4 text-center font-medium"
        >
          {day}
        </div>
      ))}
      {days.map((day) => {
        const isCurrentMonth = format(day, 'M') === format(date, 'M');
        return (
          <div
            key={day.toISOString()}
            className={`min-h-[120px] p-2 ${
              isCurrentMonth 
                ? 'hover:bg-primary/10 transition-colors cursor-pointer' 
                : 'text-muted-foreground'
            }`}
          >
            <time className="font-medium">{format(day, 'd')}</time>
          </div>
        );
      })}
    </div>
  );
}
