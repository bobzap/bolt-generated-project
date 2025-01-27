<template>
  <div class="grid grid-cols-7 divide-x divide-y">
    <div
      v-for="day in weekDays"
      :key="day"
      class="sticky top-0 bg-background/95 backdrop-blur p-4 text-center font-medium"
    >
      {{ day }}
    </div>
    <template v-for="day in calendarDays" :key="day.toISOString()">
      <div
        class="min-h-[120px] p-2"
        :class="[
          isCurrentMonth(day)
            ? 'hover:bg-primary/10 transition-colors cursor-pointer'
            : 'text-muted-foreground'
        ]"
        @click="openCreateTaskDialog(day)"
      >
        <time class="font-medium">{{ formatDay(day) }}</time>
        <div class="mt-2 space-y-1">
          <div
            v-for="task in getTasksForDay(day)"
            :key="task.id"
            class="px-2 py-1 rounded text-xs font-medium truncate"
            :style="getTaskStyle(task)"
          >
            {{ task.title }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import TaskDialog from './TaskDialog.vue';
import type { Task, Team } from '@/types/index';

const props = defineProps<{
  date: Date;
  tasks?: Task[];
  teams?: Team[];
}>();

const emit = defineEmits<{
  'create-task': [task: Partial<Task>];
}>();

const taskDialog = ref<InstanceType<typeof TaskDialog> | null>(null);

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const { date } = toRefs(props);

const calendarDays = computed(() => {
  const monthStart = startOfMonth(date.value);
  const monthEnd = endOfMonth(date.value);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let currentDay = calendarStart;

  while (currentDay <= calendarEnd) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return days;
});

const isCurrentMonth = (day: Date) =>
  format(day, 'M') === format(date.value, 'M');

const formatDay = (day: Date) => format(day, 'd');

const getTasksForDay = (day: Date) =>
  props.tasks?.filter(task => {
    const taskDate = new Date(task.startDate);
    return (
      taskDate.getDate() === day.getDate() &&
      taskDate.getMonth() === day.getMonth() &&
      taskDate.getFullYear() === day.getFullYear()
    );
  }) || [];

const openCreateTaskDialog = (day: Date) => {
  const startDate = new Date(day);
  startDate.setHours(9); // Commence à 9h par défaut
  startDate.setMinutes(0);
  taskDialog.value?.open();
};

const getTaskStyle = (task: Task) => {
  const team = props.teams?.find(t => t.id === task.teamId);
  const taskColor = team?.color || 'hsl(var(--primary))';
  return {
    backgroundColor: `${taskColor}15`,
    borderColor: `${taskColor}30`,
    borderWidth: '1px',
  };
};
</script>
