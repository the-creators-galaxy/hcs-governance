<script setup lang="ts">
import {
  currentGateway,
  GatewayProvider,
  type CastVoteParams,
} from "@/models/gateway";
import { ref, onMounted } from "vue";
import CopyPasteIcon from "./icons/CopyPasteIcon.vue";
import { network } from "@/models/info";

let resolveFn: ((value: boolean) => void) | null = null;
let rejectFn: ((value: string) => void) | null = null;

const dialog = ref<any>();
const payload = ref<string>();

onMounted(() => {
  dialog.value.addEventListener("cancel", onCancel);
});

function trySubmitCastVote(voteParams: CastVoteParams): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (dialog.value.open) {
      reject("Dialog is Already Open");
    } else {
      resolveFn = resolve;
      rejectFn = reject;
      payload.value = JSON.stringify({
        type: "cast-vote",
        ballotId: voteParams.ballotId,
        vote: voteParams.vote,
      });
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
    navigator.clipboard.writeText(payload.value!);
  }
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
