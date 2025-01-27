import { Task, Team } from '@/app/types';

class LocalStorage {
  private getItem<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  }

  private setItem<T>(key: string, value: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Teams
  getTeams(): Team[] {
    return this.getItem<Team>('teams');
  }

  addTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Team {
    const teams = this.getTeams();
    const newTeam: Team = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...team,
    };
    teams.push(newTeam);
    this.setItem('teams', teams);
    return newTeam;
  }

  // Tasks
  getTasks(): Task[] {
    return this.getItem<Task>('tasks');
  }

  addTask(task: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      id: crypto.randomUUID(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...task,
    };
    tasks.push(newTask);
    this.setItem('tasks', tasks);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    tasks[index] = updatedTask;
    this.setItem('tasks', tasks);
    return updatedTask;
  }
}

export const storage = new LocalStorage();
