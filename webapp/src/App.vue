<script setup lang="ts">
import { RouterView } from "vue-router";
import MainHeader from "@/components/MainHeader.vue";
import { onMounted } from "vue";
import { network, refreshInfo } from "./models/info";

onMounted(async () => {
  await refreshInfo();
});
</script>

<template>
  <div class="top-header">
    <MainHeader />
  </div>
  <div class="main-content">
    <RouterView v-if="network.hcsTopic" />
    <div v-else class="loading">Loading...</div>
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
  background-color: var(--cds-nd-800);
}

div.main-content {
  margin: 0;
  padding: 5rem 0 0 0;
}
</style>
