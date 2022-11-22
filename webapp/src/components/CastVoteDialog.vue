<script setup lang="ts">
import {
  currentGateway,
  GatewayProvider,
  type CastVoteParams,
} from "@/models/gateway";
import { ref, onMounted } from "vue";
import { network } from "@/models/info";
import CopyPasteIcon from "./icons/CopyPasteIcon.vue";
import HashConnectIcon from "./icons/HashConnectIcon.vue";
import { submitHcsMessage } from "@/models/hashconnect";

let resolveFn: (() => void) | null = null;

const dialog = ref<any>();
const payload = ref<string>();
const voteText = ref<string>();
const requestSent = ref(false);
const result = ref<{ success: boolean; description: string } | null>(null);

onMounted(() => {
  dialog.value.addEventListener("cancel", onCancel);
});

function trySubmitCastVote(
  { ballotId, vote }: CastVoteParams,
  voteDescription: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (dialog.value.open) {
      reject("Dialog is Already Open");
    } else {
      resolveFn = resolve;
      payload.value = JSON.stringify({
        type: "cast-vote",
        ballotId: ballotId,
        vote: vote,
      });
      voteText.value = voteDescription;
      requestSent.value = false;
      result.value = null;
      dialog.value.showModal();
    }
  });
}

function onCancel() {
  if (dialog.value.open) {
    dialog.value.close();
    if (resolveFn) {
      resolveFn();
      resolveFn = null;
    }
  }
}

function onCopyToClipboard() {
  if (dialog.value.open) {
    navigator.clipboard.writeText(payload.value!); // eslint-disable-line
  }
}

function onSendToHashconnect() {
  if (dialog.value.open) {
    result.value = null;
    requestSent.value = true;
    submitHcsMessage(network.value.hcsTopic, payload.value!).then( // eslint-disable-line
      (response) => {
        if (response.success) {
          result.value = {
            success: true,
            description: "Vote submitted.",
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
  trySubmitCastVote,
});
</script>

<template>
  <dialog ref="dialog">
    <template v-if="currentGateway === GatewayProvider.CopyAndPaste">
      <header>
        <div>Cast Vote</div>
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
        <div>Cast Vote</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <div v-if="result && result.success">
          Your vote was submitted successfully thru HashConnect.
        </div>
        <div v-else-if="result">
          We had errors submitting your vote to HCS:
          <b>{{ result.description }}</b>
        </div>
        <div v-else-if="requestSent">
          Waiting for remote wallet to submit vote to HCS ...
        </div>
        <div v-else>
          Click the <b>Send</b> button to send your vote of
          <b>{{ voteText }}</b> to your paired HashConnect wallet to sign and
          submit to the Hedera Network.
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
  padding: 1.25rem 1.5rem;
  min-width: min(90vw, 28rem);
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
