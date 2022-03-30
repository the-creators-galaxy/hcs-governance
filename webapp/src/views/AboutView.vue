<script setup lang="ts">
import MainAside from "@/components/MainAside.vue";
import EpochDateDisplay from "@/components/EpochDateDisplay.vue";
import { network, token, lastUpdated, updateLastUpdated } from "@/models/info";
import { onMounted } from "vue";

onMounted(async () => {
  await updateLastUpdated();
});
</script>

<template>
  <main>
    <MainAside />
    <section>
      <dl>
        <dt>About</dt>
        <dd>
          The Creator&rsquo;s Galaxy is a protocol &amp; decentralized ecosystem
          dedicated to empowering content creators and the future of personal
          monetization.
        </dd>
        <dt>Latest Valid Message</dt>
        <dd><EpochDateDisplay :value="lastUpdated"></EpochDateDisplay></dd>
        <dt>Hedera Network</dt>
        <dd>{{ network.network }}</dd>
        <dt>Source Mirror Node</dt>
        <dd>Grpc: {{ network.mirrorGrpc }}</dd>
        <dd>Rest: {{ network.mirrorRest }}</dd>
        <dt>Coordinating Topic Address</dt>
        <dd>{{ network.hcsTopic }}</dd>
        <dt>Voting Token Address</dt>
        <dd>{{ token.id }}</dd>
        <dt>Versions</dt>
        <dd>User Inteface: {{ network.uiVersion }}</dd>
        <dd>API Server: {{ network.apiVersion }}</dd>
      </dl>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: max-content 1fr;
  overflow: hidden;
}
section {
  display: block;
  margin: 2rem 0 0 3rem;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
dl {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 2rem 2rem 0;
  padding: 0 0 1.5rem 0;
  row-gap: 0.25rem;
  overflow-x: hidden;
  border: 1px solid var(--cds-nd-600);
  border-radius: 0.75rem;
}
dt {
  display: block;
  color: var(--cds-nl-0);
  font-weight: bold;
  font-size: 1rem;
  margin: 1.5rem 1.5rem 0 1.5rem;
  padding: 0;
}
dd {
  display: block;
  color: var(--cds-nd-200);
  font-size: 0.875rem;
  margin: 0 1.5rem;
  padding: 0;
}
</style>
