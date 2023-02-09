<script setup lang="ts">
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
    <h2>{{ network.title }} - ${{ token.symbol }}</h2>
    <dl>
      <dt>Description</dt>
      <dd>{{ network.description }}</dd>
      <dt>Latest Valid Message</dt>
      <dd>
        <EpochDateDisplay :value="lastUpdated"></EpochDateDisplay>
      </dd>
      <template v-if="network.hcsStartDate">
        <dd>
          (Proposals created before
          <EpochDateDisplay
            class="inline"
            :value="network.hcsStartDate"
          ></EpochDateDisplay>
          are not included)
        </dd>
      </template>
      <dt>Hedera Network</dt>
      <dd>{{ network.network }}</dd>
      <dt>Source Mirror Node</dt>
      <dd>Grpc: {{ network.mirrorGrpc }}</dd>
      <dd>Rest: <a v-bind:href="network.mirrorRest + '/api/v1/docs'" target="_blank">{{ network.mirrorRest }}</a></dd>
      <dt>Coordinating Topic Address</dt>
      <dd>{{ network.hcsTopic }}</dd>
      <dt>Voting Token Address</dt>
      <dd>{{ token.id }} ({{ token.symbol }})</dd>
      <template v-if="network.threshold">
        <dt>Required Threshold</dt>
        <dd>
          {{ network.threshold * 100 }}% of eligible voting balance (for newly
          created proposals)
        </dd>
      </template>
      <template v-if="network.creators.length > 1">
        <dt>Proposal Creators</dt>
        <dd>
          The following accounts are allowed to create ballot proposals:
          <ul>
            <li v-for="(acct, idx) in network.creators" :key="idx">
              {{ acct }}
            </li>
          </ul>
        </dd>
      </template>
      <template v-if="network.ineligible.length > 1">
        <dt>Ineligible Accounts</dt>
        <dd>
          The following accounts may not participate in voting:
          <ul>
            <li v-for="(acct, idx) in network.ineligible" :key="idx">
              {{ acct }}
            </li>
          </ul>
        </dd>
      </template>
      <template v-if="network.minVotingThreshold > 0 || network.minimumStandoffPeriod > 0 || network.minimumVotingPeriod > 0">
        <dt>Required Thresholds</dt>
        <dd v-if="network.minVotingThreshold > 0">Required Quorum Threshold: {{ network.minVotingThreshold.valueOf() }}</dd>
        <dd v-if="network.minimumStandoffPeriod > 0">Minimum Voting Standoff: {{ network.minimumStandoffPeriod }} {{ network.minimumStandoffPeriod > 1 ? 'days' : 'day' }}</dd>
        <dd v-if="network.minimumVotingPeriod > 0">Minimum Voting Window: {{ network.minimumVotingPeriod }} {{network.minimumVotingPeriod > 1 ? 'days' : 'day'}}</dd>        
      </template>
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
  user-select: text;
}

dd + dt {
  margin-top: 1.5rem;
}

h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--cds-nl-0);
  margin: 0;
  padding: 0 0 1.5rem 0;
}

a {
  color: var(--cds-cs-500);
  text-decoration: none;
}

a:hover {  
  text-decoration: underline;
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
