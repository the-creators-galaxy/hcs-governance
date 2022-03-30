<script setup lang="ts">
import type { Vote } from "@/models/proposal";
import BorderPanel from "./BorderPanel.vue";
import TokenBalance from "./TokenBalance.vue";
import { token } from "@/models/info";

defineProps<{ votes: Vote[]; choices: string[] }>();
</script>

<template>
  <BorderPanel>
    <template #header>Votes</template>
    <div v-if="votes.length > 0" class="vote-list">
      <template v-for="(vote, index) in votes" v-bind:key="index">
        <div class="circle"></div>
        <div>{{ vote.payerId }}</div>
        <div class="choice">{{ choices[vote.vote] }}</div>
        <TokenBalance
          class="balance"
          :amount="vote.tokenBalance"
          :decimals="token?.decimals"
        />
        <div>${{ token.symbol }}</div>
      </template>
    </div>
    <div v-else>No Votes have been cast yet.</div>
  </BorderPanel>
</template>

<style scoped>
div.vote-list {
  display: grid;
  grid-template-columns: max-content 1fr 2fr 1fr max-content;
  row-gap: 1rem;
  column-gap: 1rem;
  color: var(--cds-nl-0);
}
div.circle {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  background: var(--cds-cp-500);
}
div.choice {
  text-overflow: ellipsis;
}
span.balance {
  text-align: right;
}
</style>
