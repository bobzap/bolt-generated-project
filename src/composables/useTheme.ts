import { ref, watchEffect } from 'vue';
import { usePreferredDark } from '@vueuse/core';

export function useTheme() {
  const isDark = ref(false);
  const prefersDark = usePreferredDark();

  watchEffect(() => {
    const root = window.document.documentElement;
    if (isDark.value) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  });

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  // Initialize theme
  isDark.value = prefersDark.value;

  return {
    isDark,
    toggleTheme,
  };
}
