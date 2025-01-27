<template>
  <div class="p-6">
    <QuickTaskForm
      :teams="teams"
      @submit="handleCreateTask"
      class="mb-6 rounded-lg border shadow-sm"
    />
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          @click="previousDay"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <div
          class="inline-flex items-center space-x-2 px-3 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Calendar class="h-4 w-4" />
          <span>{{ formattedDate }}</span>
        </div>
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          @click="nextDay"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
      <CalendarHeader
        :model-value="view.type"
        @update:model-value="(type) => view.type = type"
      />
    </div>

    <div class="rounded-lg border bg-card overflow-hidden shadow-sm">
      <Transition name="fade" mode="out-in">
        <component
          :is="currentViewComponent"
          :key="view.type"
          :date="view.date"
          :tasks="tasks"
          :teams="teams"
          @create-task="handleCreateTask"
          @move-task="handleMoveTask"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import QuickTaskForm from '@/components/calendar/QuickTaskForm.vue';
import type { CalendarView, Task, Team } from '@/types/index';
import CalendarHeader from '@/components/calendar/CalendarHeader.vue';
import { DayView, WeekView, MonthView } from '@/components/calendar';

const view = ref({
  type: 'day',
  date: new Date(),
} satisfies CalendarView);

const tasks = ref<Task[]>([]);
const teams = ref<Team[]>([]);

const formattedDate = computed(() => 
  format(view.value.date, 'EEEE d MMMM yyyy', { locale: fr })
);

const currentViewComponent = computed(() => {
  switch (view.value.type) {
    case 'day': return markRaw(DayView);
    case 'week': return markRaw(WeekView);
    case 'month': return markRaw(MonthView);
    default: return markRaw(DayView);
  }
});

const previousDay = () => {
  const newDate = new Date(view.value.date);
  newDate.setDate(newDate.getDate() - 1);
  view.value.date = newDate;
};

const nextDay = () => {
  const newDate = new Date(view.value.date);
  newDate.setDate(newDate.getDate() + 1);
  view.value.date = newDate;
};

const handleCreateTask = (taskData: Partial<Task>) => {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: taskData.title || '',
    teamId: taskData.teamId || '',
    status: 'scheduled',
    duration: taskData.duration || 60,
    startDate: taskData.startDate || new Date().toISOString(),
    endDate: taskData.endDate || new Date().toISOString(),
    location: taskData.location || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.value.push(newTask);
};

const handleMoveTask = (taskId: string, newStartDate: Date) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (!task) return;

  const endDate = new Date(newStartDate);
  endDate.setMinutes(endDate.getMinutes() + task.duration);

  task.startDate = newStartDate.toISOString();
  task.endDate = endDate.toISOString();
  task.updatedAt = new Date().toISOString();
};

onMounted(() => {
  // Initialiser les équipes par défaut
  teams.value = [
    {
      id: crypto.randomUUID(),
      name: 'Équipe Nord',
      color: '#3b82f6', // Bleu moderne
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Équipe Sud',
      color: '#10b981', // Vert émeraude
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Équipe Est',
      color: '#f59e0b', // Orange ambre
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Équipe Ouest',
      color: '#8b5cf6', // Violet
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
