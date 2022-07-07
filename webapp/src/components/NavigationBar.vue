<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

const supportsDialog = ref<boolean>(typeof HTMLDialogElement === "function");
</script>

<template>
  <nav>
    <RouterLink to="/">Proposals</RouterLink>
    <RouterLink v-if="supportsDialog" to="/new">New Proposal</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 0;
  padding: 0 0 4px 0;
  gap: 2rem;
  background-color: var(--cds-nd-900);
}

a {
  display: block;
  margin: 0;
  padding: 0.5rem 0;
  line-height: 1.5rem;
  font-size: 0.875rem;
  color: var(--cds-nl-900);
  text-decoration: none;
}

a:hover {
  color: var(--cds-nl-100);
}

.router-link-active {
  color: var(--cds-nl-100);
  border-bottom: 2px solid var(--cds-cs-500);
}

@media (max-width: 350px) {
  nav {
    gap: 9.14vw;
  }
  a {
    font-size: 4vw;
  }
}
</style>
