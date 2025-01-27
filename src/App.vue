<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <div class="flex h-16 items-center px-4">
        <nav class="flex items-center space-x-6 lg:space-x-8">
          <router-link
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            :class="[
              route.path === item.to
                ? 'text-primary'
                : 'text-muted-foreground'
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
        <div class="ml-auto flex items-center space-x-4">
          <button
            @click="toggleTheme"
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Sun v-if="isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        mode="out-in"
        appear
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { Calendar, Users, Settings, Sun, Moon } from 'lucide-vue-next';

const route = useRoute();
const { isDark, toggleTheme } = useTheme();

const navigation = [
  {
    label: 'Calendrier',
    to: '/',
    icon: Calendar,
  },
  {
    label: 'Équipes',
    to: '/teams',
    icon: Users,
  },
  {
    label: 'Paramètres',
    to: '/settings',
    icon: Settings,
  },
];
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
