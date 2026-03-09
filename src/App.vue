<!--
  App — root application layout.

  Provides a fixed top navbar with the Precia brand link and a
  full-width content area where the router renders each page.
  No business logic lives here — this is layout only.
-->
<template>
  <div id="precia-app">
    <sv-navbar fixed>
      <template #left>
        <router-link to="/lists" class="navbar-brand">
          <strong>Precia</strong>
        </router-link>
      </template>
      <template #right>
        <sv-button icon transparent circle class="theme-toggle"
          :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'" @click="toggleTheme">
          <i :class="isDark ? 'bx bx-sun' : 'bx bx-moon'" />
        </sv-button>
      </template>
    </sv-navbar>
    <main class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.navbar-brand {
  text-decoration: none;
  color: inherit;
  font-size: 1.25rem;
}

.app-content {
  padding-top: 60px;
}

.theme-toggle {
  font-size: 1.2rem;
}

/* Fade transition for router view changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
