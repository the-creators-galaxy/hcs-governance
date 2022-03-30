<script setup lang="ts">
import { currentGateway, GatewayProvider } from "@/models/gateway";
import { ref, computed } from "vue";
import ButtonPanel from "./ButtonPanel.vue";
import CastVoteDialog from "./CastVoteDialog.vue";

const props = defineProps<{
  ballotId: string;
  choices: string[];
}>();
const castVoteDialog = ref<any>();
const voteSelection = ref<number>(-1);
const castVoteDisabled = computed(() => {
  return (
    voteSelection.value === -1 || currentGateway.value === GatewayProvider.None
  );
});

function selectVote(index: number) {
  voteSelection.value = index;
}

function castVote() {
  castVoteDialog.value.trySubmitCastVote({
    ballotId: props.ballotId,
    vote: voteSelection.value,
  });
  voteSelection.value = -1;
}
</script>

<template>
  <ButtonPanel>
    <template #header>Cast your vote</template>
    <button
      v-for="(choice, index) in choices"
      v-bind:key="index"
      :class="{ selected: index === voteSelection }"
      v-on:click="() => selectVote(index)"
    >
      {{ choice }}
    </button>
    <button v-on:click="castVote" :disabled="castVoteDisabled">Vote</button>
  </ButtonPanel>
  <CastVoteDialog ref="castVoteDialog" />
</template>

<style scoped>
.selected {
  background: var(--cds-cp-500);
}
</style>
