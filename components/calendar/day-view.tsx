'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DayViewProps {
  date: Date;
}

export function DayView({ date }: DayViewProps) {
  const hours = Array.from({ length: 17 }, (_, i) => i + 4).map((hour) => ({
    hour,
    label: format(new Date().setHours(hour), 'HH:00', { locale: fr })
  }));

  return (
    <div className="grid grid-cols-[80px_1fr]">
      <div className="sticky top-0 bg-background p-4 text-center font-medium">
        <div className="w-20" />
      </div>
      <div className="sticky top-0 bg-background p-4 text-center font-medium">
        {format(date, 'EEEE d MMMM', { locale: fr })}
      </div>
      <div className="col-span-2 divide-y border-t">
        {hours.map((hour) => (
          <div
            key={hour.hour}
            className="group relative h-[60px] grid grid-cols-[80px_1fr] hover:bg-primary/10 transition-colors"
          >
            <div className="px-4 py-3 text-right border-r">
              <time className="text-sm text-muted-foreground">
                {hour.label}
              </time>
            </div>
            <div className="relative">
              <div className="absolute inset-0 border-l" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
