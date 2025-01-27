export interface Task {
  id: string;
  title: string;
  teamId: string;
  status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
  description?: string;
  duration: number; // en minutes
  startDate: string;
  endDate: string;
  location: string;
  color?: string;
  conflictsWith?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarView {
  type: 'day' | 'week' | 'month';
  date: Date;
}
