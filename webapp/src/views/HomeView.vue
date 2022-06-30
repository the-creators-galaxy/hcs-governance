<script setup lang="ts">
import { ref } from "vue";
import NavigationContainer from "../components/NavigationContainer.vue";
import ProposalCard from "../components/ProposalCard.vue";
import { type Proposal, getProposals } from "../models/proposal";
import { RouterLink } from "vue-router";

const proposals = ref<Proposal[]>();

getProposals().then((i) => (proposals.value = i));
</script>

<template>
  <NavigationContainer>
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
  </NavigationContainer>
</template>

<style scoped>
ul {  
  display: block;
  margin: 0;
  padding: 0;
}
li {
  display: block;
  margin: 1.25rem 0;
  padding: 0;
}
li:hover {
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
@media (max-width: 375px) {
  h2 {
    font-weight: 700;
    font-size: 1.21875rem;
    padding: 1.625rem 1.25rem 0.125rem 1.25rem;
  }
}
</style>
