<template>
  <div class="flex items-center gap-4">
    <button
      v-for="viewType in viewTypes"
      :key="viewType.type"
      class="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      :class="[
        modelValue === viewType.type
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted'
      ]"
      @click="$emit('update:modelValue', viewType.type)"
    >
      <component :is="viewType.icon" class="h-4 w-4" />
      <span>{{ viewType.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-vue-next';
import type { CalendarView } from '@/types/index';

const props = defineProps<{
  modelValue: CalendarView['type'];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: CalendarView['type']];
}>();

const viewTypes = [
  { type: 'day' as const, label: 'Jour', icon: Calendar },
  { type: 'week' as const, label: 'Semaine', icon: CalendarDays },
  { type: 'month' as const, label: 'Mois', icon: CalendarRange },
];
</script>
