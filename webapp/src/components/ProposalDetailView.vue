<script setup lang="ts">
import { computed } from "vue";
import BackLink from "@/components/BackLink.vue";
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

const props = defineProps<{
  proposal: ProposalDetail;
  hideBackButton: boolean;
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
  <main>
    <section>
      <BackLink v-if="!hideBackButton" />
      <h2>{{ proposal.title }}</h2>
      <div class="subheading">
        <StatusDisplay :status="proposal.status"></StatusDisplay>
        <TallySummary
          v-if="proposal.status == ProposalStatus.Closed"
          :proposal="proposal"
        />
      </div>
      <div class="description">
        Description: <PossibleLink :link="proposal.description" />
      </div>
      <div class="discussion">
        Discussion: <PossibleLink :link="proposal.discussion" />
      </div>
      <CastVote
        :ballot-id="proposal.consensusTimestamp"
        :choices="proposal.choices"
        v-if="proposal.status === ProposalStatus.Voting"
      />
      <VotesDisplay
        class="votes"
        :votes="proposal.votes"
        :choices="proposal.choices"
        v-if="proposal.status !== ProposalStatus.Queued"
      />
    </section>
    <aside>
      <article class="information">
        <h3>Information</h3>
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
      </article>
      <article class="results">
        <h3>Current Results</h3>
        <div>
          <VoteCount
            v-for="(tally, index) in summary"
            :tally="tally"
            v-bind:key="index"
          />
        </div>
      </article>
    </aside>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr max-content;
  column-gap: 4rem;
  margin: 2rem 8rem;
  overflow-x: hidden;
  overflow-y: auto;
}
aside {
  min-width: 20rem;
}
aside > * {
  margin-bottom: 1.5rem;
}
article {
  overflow-x: hidden;
  border: 1px solid var(--cds-nd-600);
  border-radius: 0.75rem;
}
h2 {
  margin: 1.5rem 0;
  font-size: 1.35rem;
  font-weight: bold;
  color: var(--cds-nl-0);
}
h3 {
  font-weight: bold;
  font-size: 1.125rem;
  margin: 0;
  color: var(--cds-nl-0);
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--cds-nd-600);
}

dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  margin: 2rem;
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
article.results > div {
  display: grid;
  grid-template-columns: 1fr;
  margin: 2rem;
  row-gap: 1rem;
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
div.votes {
  margin: 1.5rem 0;
}
</style>
