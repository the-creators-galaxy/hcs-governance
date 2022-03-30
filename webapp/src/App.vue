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
  <MainHeader />
  <RouterView v-if="network.hcsTopic" />
  <div v-else class="loading">Loading...</div>
</template>

<style>
@import "@/assets/base.css";

body {
  display: grid;
  grid-template-rows: max-content 1fr;
}
div.loading {
  margin: auto;
}
</style>
