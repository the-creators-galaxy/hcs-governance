<script setup lang="ts">
import type { Proposal } from "@/models/proposal";
import { ProposalStatus } from "@/models/proposal-status";
import StatusDisplay from "@/components/StatusDisplay.vue";
import TallySummary from "./TallySummary.vue";

defineProps<{ proposal: Proposal }>();
</script>

<template>
  <article>
    <div class="id">
      <div class="proposal">By {{ proposal.author }}</div>
      <StatusDisplay :status="proposal.status"></StatusDisplay>
    </div>
    <div class="title">{{ proposal.title }}</div>
    <div class="description">{{ proposal.description }}</div>
    <TallySummary
      v-if="proposal.status == ProposalStatus.Closed"
      :proposal="proposal"
    />
    <div v-else-if="proposal.status == ProposalStatus.Queued"></div>
    <div v-else-if="proposal.expires < 1" class="expires">Closes today</div>
    <div v-else-if="proposal.expires === 1" class="expires">
      Closes tomorrow
    </div>
    <div v-else class="expires">Closes in {{ proposal.expires }} days</div>
  </article>
</template>

<style scoped>
article {
  margin: 0;
  padding: 1.25rem;
  border: 1px solid var(--cds-nd-600);
  border-radius: 0.75rem;
}

div.id {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  align-items: center;
  color: var(--cds-nd-200);
  font-size: 0.875rem;
}

div.proposal {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.5rem;
}

div.title {
  color: var(--cds-nl-0);
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

div.description {
  font-size: 1rem;
  white-space: pre-line;
  color: var(--cds-nd-200);
  margin-bottom: 0.4rem;
}

div.expires {
  font-size: 0.875rem;
  color: var(--cds-nl-800);
}

@media (max-width: 375px) {
  article {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
}
</style>
