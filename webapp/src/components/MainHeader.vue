<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  currentGateway,
  GatewayProvider,
  signalConnectWallet,
} from "@/models/gateway";
import CopyPasteIcon from "./icons/CopyPasteIcon.vue";
import HashConnectIcon from "./icons/HashConnectIcon.vue";
import WalletIcon from "./icons/WalletIcon.vue";
import { pairedWallet, openHashconnectPairRequest, closeHashconnectWallet } from "@/models/hashconnect";
import { ensureConfiguration } from "@/models/info";

const dialog = ref<any>();
const paringString = ref<string>();
const supportsDialog = ref<boolean>(typeof HTMLDialogElement === "function");
const configError = ref<string>('');

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
  if (!pairedWallet.value) {
    paringString.value = openHashconnectPairRequest();
  }
}

function changeHashconnectWallet() {  
  paringString.value = openHashconnectPairRequest();
}

function copyHahsconnectParingString() {
  navigator.clipboard.writeText(paringString.value || "");
}

function closeHashConnect() {
  currentGateway.value = GatewayProvider.None;
  closeHashconnectWallet();
}

onMounted(async () => {
  dialog.value.addEventListener("cancel", onCancel);
  try {
    await ensureConfiguration();
    if(pairedWallet.value) {
      currentGateway.value = GatewayProvider.HashConnect;
    }
  } catch (ex: any) {
    configError.value = ex.message || 'Unknown Error';
  }
});

watch(signalConnectWallet, (newValue) => {
  if (newValue) {
    onConnectWallet();
    signalConnectWallet.value = false;
  }
});
</script>

<template>
  <header class="main">
    <button v-if="!supportsDialog || !!configError" disabled>
      <span class="btn-icon">RO</span>
      <span class="btn-text">Read Only</span>
    </button>
    <button v-else-if="currentGateway === GatewayProvider.CopyAndPaste" v-on:click="onConnectWallet">
      <CopyPasteIcon />
      <span class="btn-text">Copy / Paste JSON</span>
    </button>
    <button v-else-if="currentGateway === GatewayProvider.HashConnect" v-on:click="onConnectWallet">
      <HashConnectIcon />
      <span class="btn-text">HashConnect</span>
    </button>
    <button v-else class="secondary" v-on:click="onConnectWallet">
      <WalletIcon class="btn-icon" />
      <span class="btn-text">Connect Wallet</span>
    </button>
  </header>
  <dialog ref="dialog">
    <template v-if="currentGateway === GatewayProvider.None">
      <header>
        <div>Connect Wallet</div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <button v-on:click="selectHashConnect">
          <HashConnectIcon /> HashConnect
        </button>
        <button v-on:click="selectCopyPaste">
          <CopyPasteIcon /> Copy / Paste JSON
        </button>
      </div>
    </template>
    <template v-else-if="currentGateway === GatewayProvider.CopyAndPaste">
      <header>
        <div>
          <CopyPasteIcon /> Copy / Paste JSON
        </div>
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
        <div>
          <HashConnectIcon /> HashConnect
        </div>
        <button class="close" v-on:click="onCancel"></button>
      </header>
      <div class="dlg-content">
        <div class="description">
          <template v-if="!!pairedWallet">
            <div>Connected to remote wallet:</div>
            <dl>
              <dt>Name</dt>
              <dd>{{ pairedWallet.metadata.name }}</dd>
              <dt>Description</dt>
              <dd>{{ pairedWallet.metadata.description }}</dd>
              <dt>Account</dt>
              <dd>{{ pairedWallet.accountIds.join(", ") }}</dd>
              <dt>Network</dt>
              <dd>{{ pairedWallet.network }}</dd>
            </dl>
          </template>
          <template v-else>
            <p>
              Please use the below paring string to sync this app with your
              remote HashConnect enabled wallet:
            </p>
            <p class="paring-string">
              <span>{{ paringString }}</span>
            </p>
            <button class="copy" v-on:click="copyHahsconnectParingString">
              Copy
            </button>
          </template>
        </div>
        <button v-if="currentGateway === GatewayProvider.HashConnect && pairedWallet"
          v-on:click="changeHashconnectWallet">
          Change HashConnect Wallet
        </button>
        <button v-on:click="closeHashConnect">
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
  padding: 1.5rem clamp(1.25rem, 19.72265vw - 73.959938px, 8rem);
  background-image: url("@/assets/logo.svg");
  background-repeat: no-repeat;
  background-position: clamp(1.25rem, 19.72265vw - 73.959938px, 8rem) center;
  background-size: auto calc(100% - 2.5rem);
  border-bottom: 1px solid var(--cds-nd-600);
}

header.main>button {
  padding: 0.375rem 1rem;
}

.dlg-content {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1rem;
  padding: 1.25rem 1.5rem;
}

.description {
  padding-bottom: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 10px;
  margin-right: -10px;
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

.btn-icon {
  display: none;
}

@media (max-width: 800px) {
  header.main {
    background-color: var(--cds-nd-800);
  }
}

@media (max-width: 540px) {
  header.main>button {
    width: 2rem;
  }

  header.main>button>* {
    margin-left: -1rem;
    margin-right: -1rem;
  }

  header.main>button>span.btn-text {
    display: none;
  }

  .btn-icon {
    display: inline-block;
  }
}

@media (max-width: 320px) {
  header.main {
    background-size: calc(100% - 7.35rem) auto;
  }
}
</style>
