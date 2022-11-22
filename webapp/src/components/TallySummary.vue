<script setup lang="ts">
import TokenBalance from "./TokenBalance.vue";
import { token } from "@/models/info";
import ApprovedIcon from "./icons/ApprovedIcon.vue";
import RejectedIcon from "./icons/RejectedIcon.vue";
import IndeterminateIcon from "./icons/IndeterminateIcon.vue";
import type { Proposal, ProposalDetail } from "@/models/proposal";

defineProps<{ proposal: Proposal | ProposalDetail }>();
</script>

<template>
  <div v-if="proposal.winner > -1">
    <ApprovedIcon v-if="proposal.winner === 0" />
    <RejectedIcon v-else />
    {{ proposal.choices[proposal.winner] }}
    <TokenBalance
      :amount="proposal.tally[proposal.winner]"
      :decimals="token.decimals"
    />
    <span class="symbol">${{ token.symbol }} </span>
    <span class="checksum">[{{ proposal.checksum }}]</span>
  </div>
  <div v-else class="indeterminate">
    <IndeterminateIcon />
    <template v-if="proposal.checksum">
      <span class="symbol" v-if="proposal.winner === -1">No Majority Vote</span>
      <span class="symbol" v-else-if="proposal.winner === -2">Required Threshold Not Reached</span>
      <span class="symbol" v-else>Other Tally Error</span>
      <span class="checksum">[{{ proposal.checksum }}]</span>
    </template>
    <template v-else> Results Unknown </template>
  </div>
</template>

<style scoped>
div {
  color: var(--cds-nl-0);
}
div.indeterminate {
  color: var(--cds-nl-0-60);
}
span.symbol::before {
  content: " ";
}
span.symbol::after {
  display: inline-block;
  content: " ";
  width: 2rem;
}
span.checksum {
  color: var(--cds-nl-0-60);
  user-select: all;
}
</style>
