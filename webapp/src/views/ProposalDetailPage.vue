<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import BackLink from "@/components/BackLink.vue";
import ProposalDetailView from "@/components/ProposalDetailView.vue";
import { getProposalDetails, type ProposalDetail } from "@/models/proposal";

const route = useRoute();
const loading = ref(true);
const proposal = ref<ProposalDetail | null>(null);

getProposalDetails(route.params.id as string).then((p) => {
  proposal.value = p;
  loading.value = false;
});
</script>

<template>
  <main v-if="loading">
    <section>
      <BackLink />
      <h2>Loading...</h2>
    </section>
  </main>
  <ProposalDetailView
    v-else-if="proposal"
    :proposal="proposal"
    :hide-back-button="false"
  />
  <main v-else>
    <section>
      <BackLink />
      <h2>Proposal not found.</h2>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr max-content;
  column-gap: 4rem;
  margin: 2rem 8rem;
}
</style>
