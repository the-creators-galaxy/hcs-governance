<script setup lang="ts">
import { computed } from "vue";
import TokenBalance from "./TokenBalance.vue";

export interface VoteTally {
  symbol: string;
  answer: string;
  decimals: number;
  count: number;
  total: number;
}

const props = defineProps<{ tally: VoteTally }>();
const data = computed(() => {
  const tally = props.tally;
  if (tally && props.tally.total) {
    const fraction = props.tally.count / props.tally.total;
    const progress = `width: ${(fraction * 100).toFixed(2)}%;`;
    const percentage = `${(fraction * 100).toFixed(fraction < 0.001 ? 2 : 0)}%`;
    return { progress, percentage };
  } else {
    return { progress: "", percentage: "" };
  }
});
</script>

<template>
  <div v-if="tally && tally.count" class="container">
    <span class="answer">{{ tally.answer }}</span>
    <TokenBalance :amount="tally.count" :decimals="tally.decimals" />
    <span>${{ tally.symbol }}</span>
    <span class="fraction">{{ data.percentage }}</span>
    <div class="progress"><div :style="data.progress"></div></div>
  </div>
  <div v-else class="container">
    <span class="answer">{{ tally.answer }}</span>
    <span class="count"></span>
    <span></span>
    <span class="fraction">No Votes</span>
    <div class="progress"><div style="width: 0"></div></div>
  </div>
</template>

<style scoped>
div.container {
  display: grid;
  grid-template-columns: 1fr max-content max-content 0.5fr;
  column-gap: 0.3rem;
  row-gap: 0.25rem;
  color: var(--cds-nl-0);
}
span.answer {
  overflow: hidden;
  text-overflow: ellipsis;
}
span.count {
  justify-self: end;
}
span.fraction {
  justify-self: end;
}
div.progress {
  height: 6px;
  background: var(--cds-cs-900);
  border-radius: 6px;
  grid-column: 1 / 5;
}
div.progress > div {
  height: 6px;
  border-radius: 6px;
  background-color: var(--cds-cs-500);
}
</style>
