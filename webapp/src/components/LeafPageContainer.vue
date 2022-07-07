<template>
  <main class="main-content">
    <slot></slot>
  </main>
</template>

<style scoped>
.main-content {
  display: block;
  margin: 0;
  padding: 2rem clamp(1.25rem, 19.72265vw - 73.959938px, 8rem);
  overflow-x: hidden;
  overflow-y: auto;
}
@media (max-width: 375px) {
  .main-content {
    padding: 2rem 0;
  }
}
</style>
