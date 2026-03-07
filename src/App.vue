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
    </sv-navbar>
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.navbar-brand {
  text-decoration: none;
  color: inherit;
  font-size: 1.25rem;
}

.app-content {
  padding-top: 60px;
}
</style>
