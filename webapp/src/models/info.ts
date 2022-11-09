import type { KnownNetwork } from "@bugbytes/hapi-connect";
import type { EntityIdKeyString, TimestampKeyString } from "@bugbytes/hapi-util";
import { ref } from "vue";
/**
 * Voting token information.
 */
export interface TokenInfo {
  /**
   * identifier of the token, in 0.0.123 string format.
   */
  id: EntityIdKeyString;
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
  network: KnownNetwork;
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
  hcsTopic: EntityIdKeyString;
  /**
   * If configured, the startup date & time filter for processing messages.
   */
  hcsStartDate: TimestampKeyString;
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
export const token = ref<TokenInfo>({} as TokenInfo);
/**
 * Stores a persistent value for the network information.
 */
export const network = ref<NetworkInfo>({} as NetworkInfo);
/**
 * Stores the latest updated timestamp retrieved from the remote server.
 */
export const lastUpdated = ref<string>("0.0");
/**
* Method that invoked to ensure the configuration is loaded.
* Components at the root of the dom tree should call this 
* method in mount to ensure the `network` reference is 
* properly initialized.  At this time that is the app root
* and the header (which the app root displays during loading)
* If the configuation does not pass sanity checks, a rejected
* promise is returned and `network` and `token` will be in an
* invalid state
*/
let loadTask: Promise<void>;
export function ensureConfiguration(): Promise<void> {
  if (!loadTask) {
    loadTask = refreshInfo();
  }
  return loadTask;
}
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
    hcsStartDate: json.hcsStartDate,
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
function guessNetwork(url: string): KnownNetwork {
  if (url) {
    const parts = url.toLowerCase().trim().split(".");
    if (parts.length > 0) {
      switch (parts[0]) {
        case "https://testnet":
          return "testnet";
        case "https://mainnet":
        case "https://mainnet-public":
          return "mainnet";
        case "https://previewnet":
          return "previewnet";
        }
    }
  }
  return "mainnet";
}
