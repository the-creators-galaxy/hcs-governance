<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function onClick() {
  router.back();
}
</script>

<template>
  <a class="back" v-on:click="onClick">Back</a>
</template>
