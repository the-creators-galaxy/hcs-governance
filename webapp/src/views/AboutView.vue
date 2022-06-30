<script setup lang="ts">
import MainAside from "@/components/MainAside.vue";
import EpochDateDisplay from "@/components/EpochDateDisplay.vue";
import { network, token, lastUpdated, updateLastUpdated } from "@/models/info";
import { onMounted } from "vue";
import NavigationContainer from "../components/NavigationContainer.vue";

onMounted(async () => {
  await updateLastUpdated();
});
</script>

<template>
  <NavigationContainer>
    <h2>Calaxy - $CLXY</h2>
    <dl>
      <dt>About</dt>
      <dd>
        The Creator&rsquo;s Galaxy is a protocol &amp; decentralized ecosystem
        dedicated to empowering content creators and the future of personal
        monetization.
      </dd>
      <dt>Latest Valid Message</dt>
      <dd>
        <EpochDateDisplay :value="lastUpdated"></EpochDateDisplay>
      </dd>
      <template v-if="network.hcsStartDate">
        <dd>(Proposals created before <EpochDateDisplay class="inline" :value="network.hcsStartDate"></EpochDateDisplay> are not included)</dd>
      </template>
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
  </NavigationContainer>
</template>

<style scoped>
dl {
  margin: 0;
  padding: 1.5rem;
  border: 1px solid var(--cds-nd-600);
  border-radius: 0.75rem;
}

dt {
  color: var(--cds-nl-0);
  font-weight: bold;
  font-size: 1rem;
  margin: 0.25rem 0;
  padding: 0;
  overflow: hidden;
}

dd {
  color: var(--cds-nd-200);
  font-size: 0.875rem;
  margin: 0.25rem 0;
  padding: 0;
  overflow: hidden;
}

dd+dt {
  margin-top: 1.5rem;
}

h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--cds-nl-0);
  margin: 0;
  padding: 0 0 1.5rem 0;
}

@media (max-width: 800px) {
  h2 {
    padding: 1.5rem 0;
  }
}

@media (max-width: 375px) {
  h2 {
    padding: 1.5rem 1.25rem;
  }

  dl {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
}
.inline {
  display: inline-block;
}
</style>
