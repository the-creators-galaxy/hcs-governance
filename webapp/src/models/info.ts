import { ref } from "vue";
/**
 * Voting token information.
 */
export interface TokenInfo {
  /**
   * identifier of the token, in 0.0.123 string format.
   */
  id: string;
  /**
   * The token's Symbol value.
   */
  symbol: string;
  /**
   * The name of the token.
   */
  name: string;
  /**
   * The number of decimal units for this token (to help with token value display).
   */
  decimals: number;
}
/**
 * Remote server details the user interface is relying upon for information.
 */
export interface NetworkInfo {
  /**
   * The name of the hedera ledger that is being monitored.
   */
  network: string;
  /**
   * The gRPC endpoint for the mirror node that is providing
   * HCS messages to the server.
   */
  mirrorGrpc: string;
  /**
   * The REST API endpoint for the mirror node that the server
   * is relying upon for additional message details.
   */
  mirrorRest: string;
  /**
   * The HCS topic being monitored for proposal ballot messages.
   */
  hcsTopic: string;
  /**
   * The web software user interface version.
   */
  uiVersion: string;
  /**
   * The remote data services api software version.
   */
  apiVersion: string;
}
/**
 * Stores a persistent value for the voting token information.
 */
export const token = ref<TokenInfo>({
  id: "",
  symbol: "",
  name: "",
  decimals: 0,
});
/**
 * Stores a persistent value for the network information.
 */
export const network = ref<NetworkInfo>({
  network: "disconnected",
  mirrorGrpc: "",
  mirrorRest: "",
  hcsTopic: "",
  uiVersion: __APP_VERSION__,
  apiVersion: "",
});
/**
 * Stores the latest updated timestamp retrieved from the remote server.
 */
export const lastUpdated = ref<string>("0.0");
/**
 * Method that invoked to refresh the network, token and timestamp information.
 */
export async function refreshInfo(): Promise<void> {
  const json = await fetchRemoteInfo();
  token.value = json.htsToken;
  network.value = {
    network: guessNetwork(json.mirrorRest),
    mirrorGrpc: json.mirrorGrpc,
    mirrorRest: json.mirrorRest,
    hcsTopic: json.hcsTopic,
    uiVersion: __APP_VERSION__,
    apiVersion: json.version,
  };
}
/**
 * Retrieve the latest timestamp from the server and update the `lastUpdated` value.
 */
export async function updateLastUpdated(): Promise<void> {
  const json = await fetchRemoteInfo();
  if (json.lastUpdated > lastUpdated.value) {
    lastUpdated.value = json.lastUpdated;
  }
}
/**
 * Internal helper function to retrieve remote information from the api server.
 */
async function fetchRemoteInfo(): Promise<any> {
  const url = `${import.meta.env.VITE_API_ROOT}/api/v1/info`;
  const response = await fetch(url);
  return await response.json();
}
/**
 * Helper function that attempts to produce a human readable name for
 * the currently connected hedera ledger.
 *
 * @param url url for the remote network node.
 */
function guessNetwork(url: string): string {
  if (url) {
    const parts = url.toLowerCase().trim().split(".");
    if (parts.length > 0) {
      switch (parts[0]) {
        case "testnet":
          return "Testnet";
        case "mainnet":
        case "mainnet-public":
          return "Mainnet";
        case "previewnet":
          return "Previewnet";
      }
    }
    return url;
  }
  return "unknown";
}
