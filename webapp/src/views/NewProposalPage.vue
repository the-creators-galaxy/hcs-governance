<script setup lang="ts">
import { ref, computed } from "vue";
import { currentGateway, GatewayProvider } from "@/models/gateway";
import BackLink from "@/components/BackLink.vue";
import DateRangeDialog from "../components/DateRangeDialog.vue";
import ProposalDetailView from "@/components/ProposalDetailView.vue";
import type { BallotCreateParams } from "@/models/gateway";
import type { ProposalDetail } from "@/models/proposal";
import { ProposalStatus } from "@/models/proposal-status";
import { ceilingEpochFromDate, floorEpochFromDate } from "@/models/epoch";
import { trimOptionalText } from '@/models/text';
import BorderPanel from "@/components/BorderPanel.vue";
import ButtonPanel from "@/components/ButtonPanel.vue";
import SubmitProposalDialog from "@/components/SubmitProposalDialog.vue";
import LeafPageContainer from "../components/LeafPageContainer.vue";

const dateDialog = ref<any>();
const submitDialog = ref<any>();
const ballot = ref<Partial<BallotCreateParams>>({});
const preview = ref<ProposalDetail>();

const startVotingDisplay = computed(() => {
  if (ballot.value.startDate) {
    return ballot.value.startDate.toDateString();
  }
  return "not set";
});

const endVotingDisplay = computed(() => {
  if (ballot.value.endDate) {
    return ballot.value.endDate.toDateString();
  }
  return "not set";
});

const isPublishable = computed(() => {
  const candidate = ballot.value;
  return (
    candidate.title &&
    candidate.startDate &&
    candidate.endDate &&
    currentGateway.value !== GatewayProvider.None
  );
});

function onPickRange() {
  dateDialog.value
    .promptForDateRange(ballot.value.startDate, ballot.value.endDate)
    .then((result: any) => {
      ballot.value.startDate = result.startDate;
      ballot.value.endDate = result.endDate;
    });
}

function showPreview() {
  preview.value = {
    consensusTimestamp: "0000000.0000000",
    author: "0.0.<payer>",
    title: ballot.value.title || "<Title TBD>",
    description: trimOptionalText(ballot.value.description),
    discussion: trimOptionalText(ballot.value.discussion),
    scheme: "single-choice",
    choices: ["Yes", "No"],
    expires: 7,
    status: ProposalStatus.Voting,
    startTimestamp: floorEpochFromDate(ballot.value.startDate) || "",
    endTimestamp: ceilingEpochFromDate(ballot.value.endDate) || "",
    tally: [],
    votes: [],
    winner: -1,
    checksum: "",
  };
}

function hidePreview() {
  preview.value = undefined;
}

function tryPublish() {
  submitDialog.value.trySubmitCreateBallot(ballot.value);
}
</script>

<template>
  <LeafPageContainer>
    <template v-if="preview">
      <div class="preview-back">
        <a class="back" v-on:click="hidePreview">Edit</a>
      </div>
      <ProposalDetailView :proposal="preview" :hide-back-button="true" />
    </template>
    <template v-else>
      <div class="edit-container">
        <div class="left-side">
          <BackLink />
          <input placeholder="Proposal Title (required)" class="title" v-model="ballot.title" />
          <input placeholder="Description (optional https/ipfs link or brief text)" v-model="ballot.description" />
          <input placeholder="Discussion (optional https/ipfs link or brief text)" v-model="ballot.discussion" />
          <ButtonPanel>
            <template #header>Choices</template>
            <button disabled>Single choice voting</button>
            <div class="choice">
              <span class="number">1</span>
              <span class="text">Yes</span>
              <button class="close" disabled></button>
            </div>
            <div class="choice">
              <span class="number">2</span>
              <span class="text">No</span>
              <button class="close" disabled></button>
            </div>
            <button disabled>Add Choice</button>
          </ButtonPanel>
          <BorderPanel>
            <template #header>Voting Period</template>
            <div class="calendar-buttons">
              <button v-on:click="onPickRange">
                <span class="label">Starting</span>
                <span class="value">{{ startVotingDisplay }}</span>
              </button>
              <button v-on:click="onPickRange">
                <span class="label">Thru</span>
                <span class="value">{{ endVotingDisplay }}</span>
              </button>
            </div>
          </BorderPanel>
        </div>
        <div class="right-side">
          <ButtonPanel class="aside">
            <button round v-on:click="showPreview">Preview</button>
            <button round :disabled="!isPublishable" v-on:click="tryPublish">
              Publish
            </button>
          </ButtonPanel>
        </div>
      </div>
    </template>
  </LeafPageContainer>
  <DateRangeDialog ref="dateDialog" />
  <SubmitProposalDialog ref="submitDialog" />
</template>

<style scoped>
.edit-container {
  display: grid;
  grid-template-columns: 1fr max-content;
  column-gap: 3rem;
  overflow: hidden;
}

.left-side {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.5rem;
  overflow: hidden;
}

.left-side>div.panel {
  margin-bottom: 1.5rem;
}

.right-side {
  min-width: 20rem;
  overflow: hidden;
}

.text {
  color: var(--cds-nd-200);
}

.choice {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  column-gap: 2rem;
  font-size: 1rem;
  padding: 0.65625rem 0.65625rem 0.65625rem 1rem;
  border: 1px solid var(--cds-nd-600);
  border-radius: 2.25rem;
}

.title {
  font-size: 1.33125rem;
}

.calendar-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
}

.calendar-buttons>button {
  padding: 1rem 13.5px;
  text-align: left;
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: max-content 1fr;
  background-image: url("@/assets/calendar.svg");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 24px;
}

.calendar-buttons .label {
  font-size: 0.875rem;
  color: var(--cds-nd-200);
}

.calendar-buttons .value {
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .edit-container {
    display: block;
  }
}

@media (max-width: 540px) {
  .calendar-buttons {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 1rem;
  }
}

@media (max-width: 375px) {
  .preview-back,
  .left-side>a,
  .left-side>input {
    margin-left: 1.25rem;
    margin-right: 1.25rem;
  }
}
</style>
