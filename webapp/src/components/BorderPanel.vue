<template>
  <div class="panel">
    <div class="header" v-if="$slots.header"><slot name="header"></slot></div>
    <div class="content"><slot></slot></div>
    <div class="footer" v-if="$slots.footer"><slot name="footer"></slot></div>
  </div>
</template>

<style scoped>
.panel {
  border: 1px solid var(--cds-nd-600);
  border-radius: 0.75rem;
}
.header {
  font-weight: 700;
  font-size: 1.125rem;
  padding: 1rem 1.5rem;
  color: var(--cds-nl-0);
  border-bottom: 1px solid var(--cds-nd-600);
}
.content {
  padding: 1.5rem;
}
.footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--cds-nd-600);
}
</style>
