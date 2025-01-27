<template>
  <div class="grid grid-cols-7">
    <div>
      <div class="sticky top-0 h-16 bg-background/95 backdrop-blur" />
      <template v-for="period in periods" :key="period.label">
        <div class="h-[40px] border-y p-2 text-center bg-muted/50">
          <span class="text-sm font-medium">{{ period.label }}</span>
        </div>
        <div
          v-for="hour in period.hours"
          :key="hour"
          class="h-[60px] border-b p-2 text-center"
        >
          <time class="text-sm text-muted-foreground">
            {{ formatHour(hour) }}
          </time>
        </div>
      </template>
    </div>
    <div
      v-for="(day, dayIndex) in days"
      :key="day.toISOString()"
      class="border-l"
    >
      <div class="sticky top-0 bg-background/95 backdrop-blur p-4 text-center h-16">
        <div class="font-medium">{{ formatDay(day) }}</div>
        <div class="text-sm text-muted-foreground">
          {{ formatDate(day) }}
        </div>
      </div>
      <template v-for="period in periods" :key="period.label">
        <div class="h-[40px] border-y bg-primary/10 p-2" />
        <div
          v-for="hour in period.hours"
          :key="hour"
          class="group relative h-[60px] border-b hover:bg-primary/10 transition-colors p-2 cursor-pointer"
          @click="openCreateTaskDialog(day, hour)"
        >
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Plus class="h-3 w-3" />
              Nouvelle tâche
            </button>
          </div>
          <template v-for="task in getTasksForHourAndDay(hour, day)" :key="task.id">
            <div
              class="absolute left-0 right-0 mx-2 p-2 rounded bg-primary/15 border border-primary/30 cursor-move"
              :style="getTaskStyle(task)"
              @mousedown="startDrag(task, $event)"
            >
              <div class="text-xs font-medium truncate">
                {{ task.title }}
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from 'lucide-vue-next';
import TaskDialog from './TaskDialog.vue';
import type { Task, Team } from '@/types/index';

const props = defineProps<{
  date: Date;
  tasks?: Task[];
  teams?: Team[];
}>();

const emit = defineEmits<{
  'create-task': [task: Partial<Task>];
  'move-task': [taskId: string, newStartDate: Date];
}>();

const taskDialog = ref<InstanceType<typeof TaskDialog> | null>(null);

const { date } = toRefs(props);

const weekStart = computed(() => startOfWeek(date.value, { weekStartsOn: 1 }));
const days = computed(() => 
  Array.from({ length: 6 }, (_, i) => addDays(weekStart.value, i))
);

const periods = [
  {
    label: 'Matin',
    hours: Array.from({ length: 8 }, (_, i) => i + 4),
  },
  {
    label: 'Après-midi',
    hours: Array.from({ length: 7 }, (_, i) => i + 13),
  },
];

const formatHour = (hour: number) => format(new Date().setHours(hour), 'HH:00');
const formatDay = (date: Date) => format(date, 'EEEE', { locale: fr });
const formatDate = (date: Date) => format(date, 'd MMM', { locale: fr });

const getTasksForHourAndDay = (hour: number, day: Date) => {
  return props.tasks?.filter(task => {
    const taskDate = new Date(task.startDate);
    return taskDate.getHours() === hour &&
      taskDate.getDate() === day.getDate() &&
      taskDate.getMonth() === day.getMonth() &&
      taskDate.getFullYear() === day.getFullYear();
  }) || [];
};

const getTaskStyle = (task: Task) => {
  // Pour les tâches multi-jours, on prend toute la hauteur disponible
  const isMultiDay = new Date(task.endDate).getDate() !== new Date(task.startDate).getDate();
  const team = props.teams?.find(t => t.id === task.teamId);
  const height = isMultiDay ? 960 : Math.min(task.duration / 60, 16) * 60;
  const taskDate = new Date(task.startDate);
  const hourOffset = taskDate.getHours() - 4; // Décalage par rapport à 4h du matin
  const minuteOffset = taskDate.getMinutes();
  const topOffset = (hourOffset * 60) + minuteOffset;
  const taskColor = team?.color || 'hsl(var(--primary))';

  return {
    height: `${height}px`,
    top: `${topOffset}px`,
    position: 'absolute',
    backgroundColor: `${taskColor}15`,
    borderColor: `${taskColor}30`,
    zIndex: isMultiDay ? 10 : 1,
    left: '8px',
    right: '8px',
  };
};

interface DragState {
  task: Task | null;
  startY: number;
  currentY: number;
}

const dragState = ref<DragState>({
  task: null,
  startY: 0,
  currentY: 0,
});

const startDrag = (task: Task, event: MouseEvent) => {
  dragState.value = {
    task,
    startY: event.clientY,
    currentY: event.clientY,
  };
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
};

const handleDrag = (event: MouseEvent) => {
  if (!dragState.value.task) return;
  
  dragState.value.currentY = event.clientY;
  const deltaY = dragState.value.currentY - dragState.value.startY;
  
  const pixelsPerMinute = 1;
  const minutesDelta = Math.round(deltaY / pixelsPerMinute);
  
  if (Math.abs(minutesDelta) >= 15) {
    const task = dragState.value.task;
    const newStartDate = new Date(task.startDate);
    newStartDate.setMinutes(newStartDate.getMinutes() + minutesDelta);
    
    emit('move-task', task.id, newStartDate);
    dragState.value.startY = dragState.value.currentY;
  }
};

const stopDrag = () => {
  dragState.value = {
    task: null,
    startY: 0,
    currentY: 0,
  };
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const openCreateTaskDialog = (day: Date, hour: number) => {
  const startDate = new Date(day);
  startDate.setHours(hour);
  startDate.setMinutes(0);
  taskDialog.value?.open();
};
</script>
