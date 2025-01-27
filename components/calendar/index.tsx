'use client';

import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarHeader } from './calendar-header';
import { CalendarView } from '@/app/types';
import { DayView } from './day-view';
import { WeekView } from './week-view';
import { MonthView } from './month-view';
import { storage } from '@/lib/storage';
import { Task, Team } from '@/app/types';

export function Calendar() {
  const [view, setView] = useState<CalendarView>({
    type: 'week',
    date: new Date(),
  });

  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // Initialiser quelques équipes par défaut si nécessaire
    const storedTeams = storage.getTeams();
    if (storedTeams.length === 0) {
      storage.addTeam({ name: 'Équipe A', color: '#4f46e5' });
      storage.addTeam({ name: 'Équipe B', color: '#0891b2' });
    }
    setTeams(storage.getTeams());
  }, []);

  const handleCreateTask = useCallback(async (taskData: Partial<Task>) => {
    const task = storage.addTask(taskData as any);
    setTasks(prev => [...prev, task]);
  }, []);

  useEffect(() => {
    const tasks = storage.getTasks();
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const filteredTasks = tasks.filter(task => {
      const taskStart = new Date(task.startDate);
      return taskStart >= monthStart && taskStart <= monthEnd;
    });
    
    setTasks(filteredTasks);
  }, [date]);

  const handleTaskMove = useCallback((task, newStartDate) => {
    const endDate = new Date(newStartDate);
    endDate.setMinutes(endDate.getMinutes() + task.duration);

    const updatedTask = storage.updateTask(task.id, {
      startDate: newStartDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    if (updatedTask) {
      setTasks(prev =>
        prev.map(t => (t.id === task.id ? updatedTask : t))
      );
    }
  }, []);

  const handleViewTransition = useCallback((newView: CalendarView['type']) => {
    setView(prev => ({
      type: newView,
      date: prev.date
    }));
  }, []);

  const viewProps = {
    date,
    tasks,
    teams,
    onTaskMove: handleTaskMove,
    onCreateTask: handleCreateTask,
  };

  const renderView = () => {
    switch (view.type) {
      case 'day': return <DayView {...viewProps} />;
      case 'week': return <WeekView {...viewProps} />;
      case 'month': return <MonthView {...viewProps} />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(date);
              newDate.setDate(date.getDate() - 1);
              setDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  <span>
                    {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card">
              <DatePicker
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                locale={fr}
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                  day_today: "bg-accent text-accent-foreground",
                  day: "hover:bg-muted transition-colors",
                  nav_button: "hover:bg-muted transition-colors",
                  caption: "font-medium py-2",
                }}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(date);
              newDate.setDate(date.getDate() + 1);
              setDate(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <CalendarHeader view={view} onViewChange={handleViewTransition} />
      </div>
      <motion.div
        className="rounded-lg border bg-card overflow-hidden"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderView()}
      </motion.div>
    </div>
  );
}
