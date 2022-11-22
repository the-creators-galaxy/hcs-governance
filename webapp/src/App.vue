<script setup lang="ts">
import { RouterView } from "vue-router";
import MainHeader from "@/components/MainHeader.vue";
import { onMounted, ref } from "vue";
import { ensureConfiguration, network } from "./models/info";

const loading = ref<boolean>(true);
const configError = ref<string>('');

onMounted(async () => {
  try {
    await ensureConfiguration();
  } catch (ex: any) {
    configError.value = ex.message || 'Unknown Error';
    console.dir(ex);
  }
  loading.value = false;
});
</script>

<template>
  <div class="top-header">
    <MainHeader />
  </div>
  <div class="main-content">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="configError" class="startup-error">
      <h1>A configuration error occurred.</h1>
      <p>{{ configError }}</p>
    </div>
    <RouterView v-else />
  </div>
</template>

<style>
@import "@/assets/base.css";

div.loading {
  text-align: center;
  margin-top: 30vh;
}

div.top-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background-color: var(--cds-nd-800);
}

div.main-content {
  margin: 0;
  padding: 5rem 0 0 0;
  z-index: 1;
}

div.startup-error {
  margin: 30px 20px;
  text-align: center;
}

div.startup-error>h1 {
  font-size: 24px;
  font-weight: 500;
  color: var(--cds-ui-e-500);
}
</style>
