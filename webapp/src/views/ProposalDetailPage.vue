<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import BackLink from "@/components/BackLink.vue";
import ProposalDetailView from "@/components/ProposalDetailView.vue";
import { getProposalDetails, type ProposalDetail } from "@/models/proposal";
import LeafPageContainer from "../components/LeafPageContainer.vue";

const route = useRoute();
const loading = ref(true);
const proposal = ref<ProposalDetail | null>(null);

getProposalDetails(route.params.id as string).then((p) => {
  proposal.value = p;
  loading.value = false;
});
</script>

<template>
  <LeafPageContainer>
    <BackLink />
    <h2 v-if="loading">Loading...</h2>
    <ProposalDetailView v-else-if="proposal" :proposal="proposal" :hide-back-button="false" />
    <h2 v-else>Proposal not found.</h2>
  </LeafPageContainer>
</template>

<style scoped>
@media (max-width: 375px) {
  a.back {
    margin-left: 1.25rem;
  }
}
</style>