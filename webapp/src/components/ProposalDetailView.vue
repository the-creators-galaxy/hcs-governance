<script setup lang="ts">
import { computed } from "vue";
import VoteCount from "@/components/VoteCount.vue";
import StatusDisplay from "@/components/StatusDisplay.vue";
import EpochDateDisplay from "@/components/EpochDateDisplay.vue";
import CastVote from "./CastVote.vue";
import type { ProposalDetail } from "@/models/proposal";
import { ProposalStatus } from "@/models/proposal-status";
import VotesDisplay from "./VotesDisplay.vue";
import PossibleLink from "./PossibleLink.vue";
import { token } from "@/models/info";
import TallySummary from "./TallySummary.vue";
import BorderPanel from "./BorderPanel.vue";

const props = defineProps<{
  proposal: ProposalDetail;
}>();

const summary = computed(() => {
  const symbol = token.value.symbol || "";
  const decimals = token.value.decimals || 0;
  if (props.proposal) {
    const total = props.proposal.votes.reduce((p, c) => p + c.tokenBalance, 0);
    return props.proposal.choices.map((answer, index) => {
      return {
        symbol,
        answer,
        decimals,
        count: props.proposal.tally[index] || 0,
        total,
      };
    });
  } else {
    return [];
  }
});
</script>

<template>
  <div class="detail-container">
    <div class="left-side">
      <h2>{{ proposal.title }}</h2>
      <div class="subheading">
        <StatusDisplay :status="proposal.status"></StatusDisplay>
        <TallySummary v-if="proposal.status == ProposalStatus.Closed" :proposal="proposal" />
      </div>
      <div class="description">
        Description:
        <PossibleLink :link="proposal.description" />
      </div>
      <div class="discussion">
        Discussion:
        <PossibleLink :link="proposal.discussion" />
      </div>
      <CastVote :ballot-id="proposal.consensusTimestamp" :choices="proposal.choices"
        v-if="proposal.status === ProposalStatus.Voting" />
      <VotesDisplay :votes="proposal.votes" :choices="proposal.choices"
        v-if="proposal.status !== ProposalStatus.Queued" />
    </div>
    <div class="right-side">
      <BorderPanel>
        <template #header>Information</template>
        <dl>
          <dt>Voting System</dt>
          <dd>Single Choice Voting</dd>
          <dt>Start date</dt>
          <dd>
            <EpochDateDisplay :value="proposal.startTimestamp" />
          </dd>
          <dt>End date</dt>
          <dd>
            <EpochDateDisplay :value="proposal.endTimestamp" />
          </dd>
        </dl>
      </BorderPanel>
      <BorderPanel>
        <template #header>Current Results</template>
        <div class="results">
          <VoteCount v-for="(tally, index) in summary" :tally="tally" v-bind:key="index" />
        </div>
      </BorderPanel>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  display: grid;
  grid-template-columns: 1fr max-content;
  column-gap: 4rem;
  overflow: hidden;
}

.left-side {
  overflow: hidden;
}

.right-side {  
  min-width: 20rem;
  overflow: hidden;
}

.right-side>* {
  margin-top: 1.5rem;
}

h2 {
  margin: 1.5rem 0;
  font-size: 1.35rem;
  font-weight: bold;
  color: var(--cds-nl-0);
}

dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  margin: 0;
  padding: 0;
  row-gap: 0.25rem;
  font-size: 0.875;
}

dt {
  color: var(--cds-nd-300);
}

dd {
  color: var(--cds-nl-0);
  justify-self: end;
}

div.subheading {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 1rem;
}

div.description,
div.discussion {
  margin: 1.5rem 0;
  overflow-y: auto;
  color: var(--cds-nd-200);
}

div.results>div+div {
  margin-top: 1rem;
}

.left-side>div.panel {
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .detail-container {
    display: block;
  }
}

@media (max-width: 375px) {
  h2,
  div.subheading,
  div.description,
  div.discussion {
    margin-left: 1.25rem;
    margin-right: 1.25rem;
  }
}
</style>
