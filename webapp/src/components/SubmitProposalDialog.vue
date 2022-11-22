<script setup lang="ts">
import { currentGateway, GatewayProvider } from "@/models/gateway";
import type { BallotCreateParams } from "@/models/gateway";
import { ref, onMounted } from "vue";
import { ceilingEpochFromDate, floorEpochFromDate } from "@/models/epoch";
import { trimOptionalText } from "@/models/text";
import CopyPasteIcon from "./icons/CopyPasteIcon.vue";
import { token, network } from "@/models/info";
import { submitHcsMessage } from "@/models/hashconnect";
import HashConnectIcon from "./icons/HashConnectIcon.vue";

let resolveFn: ((value: boolean) => void) | null = null;
let rejectFn: ((value: string) => void) | null = null;

const dialog = ref<any>();
const payload = ref<string>();
const requestSent = ref(false);
const result = ref<{ success: boolean; description: string } | null>(null);

onMounted(() => {
  dialog.value.addEventListener("cancel", onCancel);
});

function trySubmitCreateBallot(
  ballotParams: BallotCreateParams
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (dialog.value.open) {
      reject("Dialog is Already Open");
    } else {
      resolveFn = resolve;
      rejectFn = reject;
      payload.value = JSON.stringify({
        type: "create-ballot",
        tokenId: token.value.id,
        title: ballotParams.title,
        description: trimOptionalText(ballotParams.description),
        discussion: trimOptionalText(ballotParams.discussion),
        scheme: "single-choice",
        choices: ["Yes", "No"],
        startTimestamp: floorEpochFromDate(ballotParams.startDate),
        endTimestamp: ceilingEpochFromDate(ballotParams.endDate),
        threshold: network.value.threshold,
        ineligible: network.value.ineligible
      });
      requestSent.value = false;
      result.value = null;
      dialog.value.showModal();
    }
  });
}

function onCancel() {
  if (dialog.value.open) {
    dialog.value.close();
    if (rejectFn) {
      rejectFn("Dialog was closed without taking action.");
      resolveFn = null;
      rejectFn = null;
    }
  }
}

function onCopyToClipboard() {
  if (dialog.value.open) {
    navigator.clipboard.writeText(payload.value || "");
  }
}

function onSendToHashconnect() {
  if (dialog.value.open) {
    result.value = null;
    requestSent.value = true;
    submitHcsMessage(network.value.hcsTopic, payload.value!).then(
      (response) => {
        if (response.success) {
          result.value = {
            success: true,
            description: "Ballot Proposal Create Request Sent.",
          };
        } else {
          result.value = {
            success: false,
            description: decodeErrorDescription(response.error),
          };
        }
      }
    );
  }
}

function decodeErrorDescription(error: string) {
  if (typeof error !== "string") {
    error = JSON.stringify(error);
  }
  switch (error) {
    case "{}":
      break;
    case "USER_REJECT":
      return "The wallet rejected the signing request.";
    default:
      return error;
  }
  return "The wallet did not provide a description of the reason for the error.";
}

defineExpose({
  trySubmitCreateBallot,
});
</script>

<template>
  <dialog ref="dialog">
    <template v-if="currentGateway === GatewayProvider.CopyAndPaste">
      <header>
        <div>Publish new Proposal Ballot</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <div>
          Please Copy the following JSON and submit it as an HCS Message to the
          following HCS topic:
        </div>
        <div>
          Topic <span class="topic">{{ network.hcsTopic }}</span>
        </div>
        <div class="payload">{{ payload }}</div>
      </div>
      <footer>
        <button v-on:click="onCancel">Close</button>
        <button v-on:click="onCopyToClipboard"><CopyPasteIcon /> Copy</button>
      </footer>
    </template>
    <template v-else-if="currentGateway === GatewayProvider.HashConnect">
      <header>
        <div>Publish new Proposal Ballot</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <div v-if="result && result.success">
          Your ballot proposal was submitted successfully thru HashConnect,
          please check the list of ballots to confirm it passed validation and
          listed.
        </div>
        <div v-else-if="result">
          We had errors submitting your ballot proposal to HCS:
          <b>{{ result.description }}</b>
        </div>
        <div v-else-if="requestSent">
          Waiting for remote wallet to submit your ballot proposal to HCS ...
        </div>
        <div v-else>
          Click the <b>Send</b> button to send ballot proposal to your paired
          HashConnect wallet to sign and submit to the Hedera Network.
        </div>
      </div>
      <footer>
        <button v-on:click="onCancel">Close</button>
        <button v-on:click="onSendToHashconnect" v-bind:disabled="requestSent">
          <HashConnectIcon /> Send
        </button>
      </footer>
    </template>
    <template v-else>
      <header>
        <div>Not Connected</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <div>Please connect to a wallet before continuing.</div>
      </div>
      <footer class="single">
        <button v-on:click="onCancel">Close</button>
      </footer>
    </template>
  </dialog>
</template>

<style scoped>
.dlg-content {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1rem;
  padding: 1.25rem 0rem 1.25rem 1.5rem;
  min-width: min(80vw, 28rem);
}

.dlg-content > div {
  max-width: min(90vw, 28rem);
}

.single {
  grid-template-columns: 1fr;
}

.topic {
  user-select: all;
  color: var(--cds-nl-0);
}

.payload {
  user-select: all;
  word-wrap: break-word;
  color: var(--cds-nl-0);
}
</style>
