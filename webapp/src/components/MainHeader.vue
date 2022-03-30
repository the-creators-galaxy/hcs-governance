<script setup lang="ts">
import { ref, onMounted } from "vue";
import { currentGateway, GatewayProvider } from "@/models/gateway";
import CopyPasteIcon from "./icons/CopyPasteIcon.vue";
const dialog = ref<any>();

async function onConnectWallet() {
  dialog.value.showModal();
}

function onCancel() {
  if (dialog.value.open) {
    dialog.value.close();
  }
}

function selectCopyPaste() {
  currentGateway.value = GatewayProvider.CopyAndPaste;
  if (dialog.value.open) {
    dialog.value.close();
  }
}

onMounted(() => {
  dialog.value.addEventListener("cancel", onCancel);
});
</script>

<template>
  <header class="main">
    <button
      v-if="currentGateway === GatewayProvider.CopyAndPaste"
      v-on:click="onConnectWallet"
    >
      <CopyPasteIcon /> Copy / Paste JSON
    </button>
    <button v-else class="secondary" v-on:click="onConnectWallet">
      Connect Wallet
    </button>
  </header>
  <dialog ref="dialog">
    <template v-if="currentGateway === GatewayProvider.None">
      <header>
        <div>Connect Wallet</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <button v-on:click="selectCopyPaste">
          <CopyPasteIcon /> Copy / Paste JSON
        </button>
      </div>
    </template>
    <template v-else-if="currentGateway === GatewayProvider.CopyAndPaste">
      <header>
        <div><CopyPasteIcon /> Copy / Paste JSON</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <div class="description">
          With the Copy/Paste mode, this site will generate the JSON HCS message
          payload and it will be up to the user to copy this payload and submit
          it to the network using the tool of their choice.
        </div>
        <button v-on:click="currentGateway = GatewayProvider.None">
          Switch Wallet
        </button>
        <button v-on:click="onCancel">Close</button>
      </div>
    </template>
    <template v-else>
      <header>
        <div>Not Done</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div>not done yet</div>
    </template>
  </dialog>
</template>

<style scoped>
header.main {
  text-align: right;
  padding: 1.25rem 8rem;
  border-bottom: 1px solid var(--cds-nd-600);
  background-image: url("@/assets/logo.svg");
  background-repeat: no-repeat;
  background-position: 8rem center;
  background-size: auto calc(100% - 2.5rem);
}
header.main > button {
  padding: 0.375rem 1rem;
}
.dlg-content {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1rem;
  padding: 1.25rem 1.5rem;
  min-width: min(90vw, 28rem);
}
.description {
  max-width: min(90vw, 28rem);
  margin-bottom: 1rem;
}
</style>
