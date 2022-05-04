<script setup lang="ts">
import { ref, onMounted } from "vue";
import { currentGateway, GatewayProvider } from "@/models/gateway";
import CopyPasteIcon from "./icons/CopyPasteIcon.vue";
import HashConnectIcon from "./icons/HashConnectIcon.vue";
import {
  hashconnectInfo,
  initializeHashconnect,
  openPairRequest,
} from "@/models/hashconnect";
const dialog = ref<any>();
const paringString = ref<string>();

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

function selectHashConnect() {
  currentGateway.value = GatewayProvider.HashConnect;
  initializeHashconnect();
  if (!hashconnectInfo.value.pairedWallet) {
    paringString.value = openPairRequest().pairingString;
  }
}

function changeHashconnectWallet() {
  paringString.value = openPairRequest().pairingString;
}

function copyHahsconnectParingString() {
  navigator.clipboard.writeText(paringString.value || "");
}

function closeHashConnect() {
  currentGateway.value = GatewayProvider.None;
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
    <button
      v-else-if="currentGateway === GatewayProvider.HashConnect"
      v-on:click="onConnectWallet"
    >
      <HashConnectIcon /> HashConnect
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
        <button v-on:click="selectHashConnect">
          <HashConnectIcon /> HashConnect
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
        <button v-on:click="closeHashConnect">Switch Wallet</button>
        <button v-on:click="onCancel">Close</button>
      </div>
    </template>
    <template v-else-if="currentGateway === GatewayProvider.HashConnect">
      <header>
        <div><HashConnectIcon /> HashConnect</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <div class="description">
          <template v-if="hashconnectInfo.pairedWallet">
            <div>Connected to remote wallet:</div>
            <dl>
              <dt>Name</dt>
              <dd>{{ hashconnectInfo.pairedWallet.metadata.name }}</dd>
              <dt>Description</dt>
              <dd>{{ hashconnectInfo.pairedWallet.metadata.description }}</dd>
              <dt>Account</dt>
              <dd>{{ hashconnectInfo.pairedWallet.accountIds.join(", ") }}</dd>
              <dt>Network</dt>
              <dd>{{ hashconnectInfo.pairedWallet.network }}</dd>
            </dl>
          </template>
          <template v-else>
            <p>
              Please use the below paring string to sync this app with your
              remote HasConnect enabled wallet:
            </p>
            <p class="paring-string">
              <span>{{ paringString }}</span>
            </p>
            <button class="copy" v-on:click="copyHahsconnectParingString">
              Copy
            </button>
          </template>
        </div>
        <button
          v-if="
            currentGateway === GatewayProvider.HashConnect &&
            hashconnectInfo.pairedWallet
          "
          v-on:click="changeHashconnectWallet"
        >
          Change HashConnect Wallet
        </button>
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
.description dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  margin: 1rem;
  padding: 0;
  row-gap: 0.25rem;
  font-size: 0.875;
}
.description dd {
  color: var(--cds-nl-0);
}

.paring-string {
  color: var(--cds-nl-300);
  word-wrap: break-word;
}

.copy {
  float: right;
  margin-left: 1rem;
}
</style>
