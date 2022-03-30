<script setup lang="ts">
import { dateFromEpoch } from "@/models/epoch";
import { computed } from "vue";

const props = defineProps<{ value: string }>();

const display = computed<string>(() => {
  if (props.value) {
    return dateFromEpoch(props.value).toLocaleString();
  }
  return "n/a";
});
</script>

<template>
  <div>{{ display }}</div>
</template>

<style scoped>
div {
  user-select: all;
}
</style>
