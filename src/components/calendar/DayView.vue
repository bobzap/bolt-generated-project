<template>
  <div class="grid grid-cols-[80px_1fr]">
    <div class="sticky top-0 bg-background/95 backdrop-blur p-4 text-center font-medium">
      <div class="w-20" />
    </div>
    <div class="sticky top-0 bg-background/95 backdrop-blur p-4 text-center font-medium">
      {{ formattedDate }}
    </div>
    <div class="col-span-2 divide-y border-t">
      <div
        v-for="hour in hours"
        :key="hour.hour"
        class="group relative h-[60px] grid grid-cols-[80px_1fr] hover:bg-primary/5 transition-colors"
      >
        <div class="px-4 py-3 text-right border-r">
          <time class="text-sm text-muted-foreground">
            {{ hour.label }}
          </time>
        </div>
        <div class="relative">
          <div class="absolute inset-0 border-l border-border/50" />
          <div
            v-if="isCurrentHour(hour.hour)"
            class="absolute left-0 right-0 top-0 h-px bg-primary"
          />
          <div
            v-for="task in getTasksForHour(hour.hour)"
            :key="task.id"
            class="absolute left-0 right-0 mx-2 p-2 rounded bg-primary/15 border border-primary/30 cursor-move"
            :style="getTaskStyle(task)"
            @mousedown="startDrag(task, $event)"
          >
            <div class="text-xs font-medium truncate">
              {{ task.title }}
            </div>
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            @click="openCreateTaskDialog(hour.hour)"
          >
            <button
              class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Plus class="h-3 w-3" />
              Nouvelle tâche
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { format } from 'date-fns';
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

const formattedDate = computed(() => 
  format(date.value, 'EEEE d MMMM', { locale: fr })
);

const hours = computed(() => 
  Array.from({ length: 17 }, (_, i) => i + 4).map((hour) => ({
    hour,
    label: format(new Date().setHours(hour), 'HH:00', { locale: fr })
  }))
);

const isCurrentHour = (hour: number) => {
  const now = new Date();
  return now.getHours() === hour && 
    now.getDate() === props.date.getDate() &&
    now.getMonth() === props.date.getMonth() &&
    now.getFullYear() === props.date.getFullYear();
};

const getTasksForHour = (hour: number) => {
  return props.tasks?.filter(task => {
    const taskDate = new Date(task.startDate);
    return taskDate.getHours() === hour &&
      taskDate.getDate() === props.date.getDate() &&
      taskDate.getMonth() === props.date.getMonth() &&
      taskDate.getFullYear() === props.date.getFullYear();
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
  
  // Calculate new time based on deltaY
  const pixelsPerMinute = 1; // Adjust this value as needed
  const minutesDelta = Math.round(deltaY / pixelsPerMinute);
  
  if (Math.abs(minutesDelta) >= 15) { // Only move in 15-minute increments
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

const openCreateTaskDialog = (hour: number) => {
  const startDate = new Date(props.date);
  startDate.setHours(hour);
  startDate.setMinutes(0);
  taskDialog.value?.open();
};
</script>
