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
    ${{ token.symbol }}
    <span class="checksum">[{{ proposal.checksum }}]</span>
  </div>
  <div v-else class="indeterminate">
    <IndeterminateIcon />
    <template v-if="proposal.checksum">
      No Majority Vote
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
span.checksum {
  margin-left: 1rem;
  color: var(--cds-nl-0-60);
  user-select: all;
}
</style>
