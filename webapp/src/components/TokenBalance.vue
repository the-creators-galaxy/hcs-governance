<script setup lang="ts">
import { computed } from "vue";

const separator = (1.1).toLocaleString().charAt(1);

const props = defineProps<{ amount: number; decimals: number }>();

const data = computed(() => {
  let display = "";
  let detail = "";
  let whole = props.amount;
  let frac = 0;
  if (props.decimals > 0) {
    const mult = Math.pow(10, props.decimals);
    whole = Math.floor(props.amount / mult);
    frac = props.amount % mult;
    detail = `${whole.toLocaleString()}${separator}${frac
      .toString(10)
      .padStart(props.decimals, "0")}`;
  }
  if (whole > 1000000000000) {
    display = `${(whole / 1000000000000).toFixed(2)}t`;
  } else if (whole > 1000000000) {
    display = `${(whole / 1000000000).toPrecision(3)}b`;
  } else if (whole > 1000000) {
    display = `${(whole / 1000000).toPrecision(3)}m`;
  } else if (whole > 1000) {
    display = `${(whole / 1000).toPrecision(3)}k`;
  } else if (whole > 10 && frac > 0) {
    display = parseFloat(detail).toPrecision(4);
  } else if (frac > 0) {
    display = detail;
  } else {
    display = whole.toString();
  }
  return { display, detail };
});
</script>

<template>
  <span :title="data.detail">{{ data.display }}</span>
</template>
