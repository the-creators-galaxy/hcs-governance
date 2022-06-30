<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ link: string }>();
const data = computed(() => {
  if (props.link) {
    if (props.link.startsWith("https://")) {
      return { href: props.link, text: props.link };
    } else if (props.link.startsWith("ipfs://")) {
      return {
        href: "https://ipfs.io/ipfs/" + props.link.substring(7),
        text: props.link,
      };
    } else {
      return { href: "", text: props.link };
    }
  } else {
    return { href: "", text: "No Information" };
  }
});
</script>
<template>
  <a v-if="data.href" :href="data.href" target="_blank">{{ data.text }}</a>
  <span v-else>{{ data.text }}</span>
</template>
<style scoped>
a {
  user-select: text;
  color: var(--cds-cs-500);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
span {
  user-select: text;
  color: var(--cds-nl-500);
}
</style>
