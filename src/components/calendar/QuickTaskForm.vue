<template>
  <div class="p-6 border-b bg-card shadow-sm">
    <form @submit.prevent="handleSubmit" class="grid grid-cols-6 gap-4">
      <div class="space-y-2 col-span-2">
        <label class="text-sm font-medium">Équipe</label>
        <select
          v-model="form.teamId"
          class="w-full px-3 py-2 rounded-md border bg-background"
          required
        >
          <option value="" disabled>Sélectionner</option>
          <option
            v-for="team in teams"
            :key="team.id"
            :value="team.id"
            :style="{ backgroundColor: `${team.color}15` }"
          >
            {{ team.name }}
          </option>
        </select>
      </div>

      <div class="space-y-2 col-span-2">
        <label class="text-sm font-medium">Type de travaux</label>
        <select
          v-model="form.workType"
          class="w-full px-3 py-2 rounded-md border bg-background"
          required
        >
          <option value="" disabled>Sélectionner</option>
          <option value="installation">Installation</option>
          <option value="maintenance">Maintenance</option>
          <option value="depannage">Dépannage</option>
          <option value="renovation">Rénovation</option>
        </select>
      </div>

      <div class="space-y-2 col-span-2">
        <label class="text-sm font-medium">Durée</label>
        <div class="flex gap-2">
          <div class="flex-1 grid grid-cols-2 gap-2">
            <div class="relative">
              <input
                v-model.number="form.days"
                type="number"
                min="0"
                max="30"
                class="w-full px-3 py-2 rounded-md border bg-background pr-12"
                placeholder="0"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                jours
              </span>
            </div>
            <div class="relative">
              <input
                v-model.number="form.hours"
                type="number"
                min="0"
                max="23"
                class="w-full px-3 py-2 rounded-md border bg-background pr-12"
                placeholder="0"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                heures
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2 col-span-2">
        <label class="text-sm font-medium">Date & Heure</label>
        <div class="flex gap-2">
          <input
            type="date"
            v-model="form.startDate"
            class="flex-1 px-3 py-2 rounded-md border bg-background min-w-[180px]"
            required
          />
          <input
            type="time"
            v-model="form.startTime"
            class="w-32 px-3 py-2 rounded-md border bg-background min-w-[120px]"
            required
          />
        </div>
      </div>

      <div class="space-y-2 col-span-2">
        <label class="text-sm font-medium">Adresse</label>
        <input
          v-model="form.location"
          type="text"
          class="w-full px-3 py-2 rounded-md border bg-background"
          placeholder="Numéro, rue, code postal, ville"
          required
        />
      </div>

      <div class="flex items-end">
        <button
          type="submit"
          class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Planifier
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Task, Team } from '@/types/index';

const props = defineProps<{
  teams: Team[];
}>();

const emit = defineEmits<{
  'submit': [task: Partial<Task>];
}>();

const form = ref({
  teamId: '',
  workType: '',
  days: 0,
  hours: 1,
  startDate: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  location: '',
});

const handleSubmit = () => {
  // Calculer la durée totale en minutes
  const totalMinutes = (form.value.days * 24 * 60) + (form.value.hours * 60);
  
  // Créer la date de début
  const startDate = new Date(`${form.value.startDate}T${form.value.startTime}`);
  
  // Calculer la date de fin
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + totalMinutes);

  emit('submit', {
    teamId: form.value.teamId,
    title: `${form.value.workType} - ${form.value.location}`,
    duration: totalMinutes,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    location: form.value.location,
  });

  // Reset form
  form.value = {
    teamId: '',
    workType: '',
    days: 0,
    hours: 1,
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    location: '',
  };
};
</script>
