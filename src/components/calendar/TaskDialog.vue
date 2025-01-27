<template>
  <Dialog v-model="isOpen">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-semibold">Nouvelle tâche</h2>
        <p class="text-sm text-muted-foreground">
          {{ formattedDate }}
        </p>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Titre</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="Titre de la tâche"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Équipe</label>
          <select
            v-model="form.teamId"
            class="w-full px-3 py-2 rounded-md border bg-background"
            required
          >
            <option value="" disabled>Sélectionner une équipe</option>
            <option
              v-for="team in teams"
              :key="team.id"
              :value="team.id"
            >
              {{ team.name }}
            </option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Durée (minutes)</label>
          <input
            v-model.number="form.duration"
            type="number"
            min="15"
            max="480"
            step="15"
            class="w-full px-3 py-2 rounded-md border bg-background"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Lieu</label>
          <input
            v-model="form.location"
            type="text"
            class="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="Lieu (optionnel)"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-md hover:bg-muted"
            @click="isOpen = false"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Dialog from '@/components/ui/Dialog.vue';
import type { Task, Team } from '@/types/index';

const props = defineProps<{
  startDate: Date;
  teams: Team[];
}>();

const emit = defineEmits<{
  'submit': [task: Partial<Task>];
}>();

const isOpen = ref(false);

const formattedDate = computed(() => 
  format(props.startDate, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })
);

const form = ref({
  title: '',
  teamId: '',
  duration: 60,
  location: '',
});

const handleSubmit = () => {
  const endDate = new Date(props.startDate);
  endDate.setMinutes(endDate.getMinutes() + form.value.duration);

  emit('submit', {
    ...form.value,
    startDate: props.startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  // Reset form and close dialog
  form.value = {
    title: '',
    teamId: '',
    duration: 60,
    location: '',
  };
  isOpen.value = false;
};

// Expose open method
defineExpose({
  open: () => {
    isOpen.value = true;
  },
});
</script>
