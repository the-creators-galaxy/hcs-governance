<script setup lang="ts">
import MainAside from "./MainAside.vue";
import NavigationBar from "./NavigationBar.vue";
</script>

<template>
  <div class="top-nav">
    <NavigationBar />
  </div>
  <main class="main-content">
    <MainAside class="floating-nav" />
    <section>
      <slot></slot>
    </section>
  </main>
</template>

<style scoped>
.main-content {
  display: block;
  margin: 0;
  padding: 2rem clamp(1.25rem, 19.72265vw - 73.959938px, 8rem) 0
    calc(
      min(20vw, 20rem) + 3rem + clamp(1.25rem, 19.72265vw - 73.959938px, 8rem)
    );
  overflow: hidden;
}
.floating-nav {
  left: clamp(1.25rem, 19.72265vw - 73.959938px, 8rem);
  position: fixed;
}
.top-nav {
  display: none;
  position: fixed;
  margin-top: 1px;
  left: 0;
  right: 0;
  padding: 0 clamp(1.25rem, 19.72265vw - 73.959938px, 8rem);
  background-color: var(--cds-nd-900);
}
@media (max-width: 800px) {
  .main-content {
    padding: 4.625rem clamp(1.25rem, 19.72265vw - 73.959938px, 8rem);
  }
  .floating-nav {
    display: none;
  }
  .top-nav {
    display: flex;
  }
}
@media (max-width: 375px) {
  .main-content {
    padding: 2rem 0;
  }
}
</style>
