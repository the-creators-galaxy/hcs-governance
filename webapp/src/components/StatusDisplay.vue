<script setup lang="ts">
import { ProposalStatus } from "../models/proposal-status";

defineProps<{ status: ProposalStatus }>();
</script>

<template>
  <div v-if="status === ProposalStatus.Voting" class="active">Voting</div>
  <div v-else-if="status === ProposalStatus.Queued" class="queued">Queued</div>
  <div v-else-if="status === ProposalStatus.Closed" class="closed">Closed</div>
  <div v-else>Unknown</div>
</template>

<style scoped>
div {
  font-size: 0.875rem;
  color: var(--cds-nd-200);
  border: 1px solid var(--cds-nd-200);
  padding: 0.25rem 0.75rem;
  border-radius: 6.25rem;
}
div.closed {
  color: var(--cds-cp-400);
  border-color: var(--cds-cp-400);
}
div.active {
  color: var(--cds-cs-400);
  border-color: var(--cds-cs-400);
}
div.queued {
  color: var(--cds-ui-i-600);
  border-color: var(--cds-ui-i-600);
}
</style>
