<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

const supportsDialog = ref<boolean>(typeof HTMLDialogElement === 'function');
</script>

<template>
  <aside>
    <header>Calaxy - $CLXY</header>
    <nav>
      <RouterLink to="/">Proposals</RouterLink>
      <RouterLink v-if="supportsDialog" to="/new">New Proposal</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
aside {
  margin: 0;
  width: min(20vw, 20rem);
  border: 1px solid var(--cds-nd-600);
  border-radius: 0.75rem;
}

header {
  text-align: center;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--cds-nl-0);
  padding: 8rem 1rem 2rem 1rem;
  border-bottom: 1px solid var(--cds-nd-600);
  background-image: url("@/assets/myro.svg");
  background-repeat: no-repeat;
  background-position: center top 2rem;
}

nav {
  margin: 1.5rem 0;
}

a {
  color: var(--cds-nl-0);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.5rem 1.5rem;
  display: block;
}

a:hover {
  background-color: var(--cds-nl-0-20);
}

.router-link-active {
  box-shadow: inset 4px 0px 0px 0px var(--cds-cs-500);
}
</style>
