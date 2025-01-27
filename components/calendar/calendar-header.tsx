'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarView } from '@/app/types';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const views = [
  {
    type: 'day',
    label: 'Jour',
    icon: Calendar,
  },
  {
    type: 'week',
    label: 'Semaine',
    icon: CalendarDays,
  },
  {
    type: 'month',
    label: 'Mois',
    icon: CalendarRange,
  },
] as const;

export function CalendarHeader({ view, onViewChange }: CalendarHeaderProps) {
  const currentView = views.find((v) => v.type === view.type);
  const Icon = currentView?.icon || Calendar;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon className="h-4 w-4" />
          {currentView?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {views.map((v) => (
          <DropdownMenuItem
            key={v.type}
            onClick={() => onViewChange({ type: v.type, date: view.date })}
          >
            <v.icon className="mr-2 h-4 w-4" />
            {v.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
