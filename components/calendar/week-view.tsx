'use client';

import * as React from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { TaskDialog } from './task-dialog';
import { Task, Team } from '@/app/types';

interface WeekViewProps {
  date: Date;
  tasks?: Task[];
  teams: Team[];
  onTaskMove?: (task: Task, newStartDate: Date) => void;
  onCreateTask?: (task: Partial<Task>) => Promise<void>;
}

export function WeekView({ date, tasks = [], teams = [], onTaskMove, onCreateTask }: WeekViewProps) {
  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)); // Lundi à Samedi
  
  const periods = [
    { label: 'Matin', hours: Array.from({ length: 8 }, (_, i) => i + 4) },
    { label: 'Après-midi', hours: Array.from({ length: 7 }, (_, i) => i + 13) },
  ];

  const getTaskPosition = (task: Task, cellDate: Date, hour: number) => {
    const startHour = new Date(task.startDate).getHours();
    const duration = task.duration;
    
    if (isSameDay(new Date(task.startDate), cellDate) && startHour === hour) {
      const height = Math.min(duration / 60, 1) * 60;
      return {
        top: '0px',
        height: `${height}px`,
      };
    }
    return null;
  };

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setDraggedTask(task);
  };

  const handleDragEnd = (event: any) => {
    setDraggedTask(null);
    if (!event.over || !draggedTask) return;

    const [dayIndex, hour] = event.over.id.split('-').map(Number);
    const newDate = addDays(weekStart, dayIndex);
    newDate.setHours(hour);
    
    onTaskMove?.(draggedTask, newDate);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
    <div className="grid grid-cols-7">
      <div>
        <div className="sticky top-0 h-16 bg-background" />
        {periods.map((period) => (
          <React.Fragment key={period.label}>
            <div className="h-[40px] border-y p-2 text-center bg-muted/50">
              <span className="text-sm font-medium">{period.label}</span>
            </div>
            {period.hours.map((hour) => (
              <div key={hour} className="h-[60px] border-b p-2 text-center">
                <time className="text-sm text-muted-foreground">
                  {format(new Date().setHours(hour), 'HH:00')}
                </time>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      {days.map((day, dayIndex) => (
        <div key={day.toISOString()} className="border-l">
          <div className="sticky top-0 bg-background p-4 text-center h-16">
            <div className="font-medium">{format(day, 'EEEE', { locale: fr })}</div>
            <div className="text-sm text-muted-foreground">
              {format(day, 'd MMM', { locale: fr })}
            </div>
          </div>
          {periods.map((period) => (
            <React.Fragment key={period.label}>
              <div className="h-[40px] border-y bg-primary/10 p-2" />
              {period.hours.map((hour) => (
                <div
                  key={hour}
                  className="group relative h-[60px] border-b hover:bg-primary/10 transition-colors p-2 cursor-pointer"
                  data-droppable
                  id={`${dayIndex}-${hour}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <TaskDialog
                      startDate={(() => {
                        const taskDate = new Date(day);
                        taskDate.setHours(hour);
                        taskDate.setMinutes(0);
                        return taskDate;
                      })()}
                      teams={teams}
                      onSubmit={onCreateTask}
                    />
                  </div>
                  <AnimatePresence>
                    {tasks
                      .filter(task => {
                        const position = getTaskPosition(task, day, hour);
                        return position !== null;
                      })
                      .map(task => (
                        <motion.div
                          key={task.id}
                          layoutId={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={getTaskPosition(task, day, hour)}
                          className="absolute left-0 right-0 m-1 p-2 rounded bg-primary/15 border border-primary/30 cursor-move"
                          data-draggable
                          id={task.id}
                        >
                          <div className="text-xs font-medium truncate">
                            {task.title}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ))}
      <DragOverlay>
        {draggedTask && (
          <div className="p-2 rounded bg-primary/30 border border-primary shadow-lg">
            <div className="text-xs font-medium truncate">
              {draggedTask.title}
            </div>
          </div>
        )}
      </DragOverlay>
    </div>
    </DndContext>
  );
}
