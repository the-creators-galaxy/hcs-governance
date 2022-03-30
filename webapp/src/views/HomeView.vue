<script setup lang="ts">
import { ref } from "vue";
import MainAside from "../components/MainAside.vue";
import ProposalCard from "../components/ProposalCard.vue";
import { type Proposal, getProposals } from "../models/proposal";
import { RouterLink } from "vue-router";

const proposals = ref<Proposal[]>();

getProposals().then((i) => (proposals.value = i));
</script>

<template>
  <main>
    <MainAside />
    <section>
      <h2>Proposals</h2>
      <ul>
        <li v-for="proposal in proposals" :key="proposal.consensusTimestamp">
          <RouterLink
            :to="{
              name: 'proposal',
              params: { id: proposal.consensusTimestamp },
            }"
          >
            <ProposalCard :proposal="proposal" />
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: max-content 1fr;
  overflow: hidden;
}
section {
  display: grid;
  grid-template-rows: max-content 1fr;
  margin: 2rem 0 0 3rem;
  padding: 0;
  row-gap: 1.5rem;
  align-content: start;
  overflow-x: hidden;
  overflow-y: auto;
}
ul {
  display: grid;
  grid-template-rows: max-content;
  margin: 0;
  padding: 0 2rem 2rem 0;
  row-gap: 1.25rem;
  align-content: start;
  list-style-type: none;
  overflow-x: hidden;
  overflow-y: auto;
}
li {
  display: block;
  margin: 0;
  padding: 0;
}
li:hover article {
  background-color: var(--cds-nl-0-10);
}
li > a {
  text-decoration: none;
}
h2 {
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: 1.3125rem;
  color: var(--cds-nl-0);
}
</style>
