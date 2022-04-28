import { AccountID, SignatureMap, TopicID } from "@/proto/basic_types";
import { ConsensusSubmitMessageTransactionBody } from "@/proto/consensus_submit_message";
import { Transaction } from "@/proto/transaction";
import { TransactionBody } from "@/proto/transaction_body";
import { SignedTransaction } from "@/proto/transaction_contents";
import { ref } from "vue";
import {
  createParingString,
  HashConnectClient,
  type TransactionResponse,
  type WalletMetadata,
} from "./hashconnect-client";
import { network } from "./info";
declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

const HASHCONNECT_KEY = "hashconnect.data";

let client: HashConnectClient | null = null;

export const hashconnectInfo = ref<ConnectionInfo>({} as ConnectionInfo);

export interface PairRequest {
  pairingString: string;
  pairCompleted: Promise<WalletMetadata>;
}

export interface ConnectionInfo {
  topic: string | undefined;
  secret: string | undefined;
  pairedWallet: WalletMetadata | undefined;
}

export function initializeHashconnect(): void {
  const value = localStorage.getItem(HASHCONNECT_KEY);
  const data = value
    ? (JSON.parse(value) as ConnectionInfo)
    : hashconnectInfo.value;
  if (!data.topic || !data.secret || !data.pairedWallet) {
    data.topic = crypto.randomUUID();
    data.secret = crypto.randomUUID();
    data.pairedWallet = undefined;
    localStorage.setItem(HASHCONNECT_KEY, JSON.stringify(data));
  }
  client = new HashConnectClient();
  client.connect(data.topic, data.secret);
  hashconnectInfo.value = data;
}

export function openPairRequest(): PairRequest {
  closeWallet();
  const data = hashconnectInfo.value;
  const networkName =
    network.value.network.toLowerCase() == "mainnet" ? "mainnet" : "testnet";
  const pairingString = createParingString(
    data.topic!,
    data.secret!,
    "TCG Governance",
    "TCG Governance App",
    networkName
  );
  const pairCompleted = client!.waitForPairing(data.topic!).then((metadata) => {
    const currentData = hashconnectInfo.value;
    if (data.topic === currentData.topic) {
      data.pairedWallet = metadata;
      localStorage.setItem(HASHCONNECT_KEY, JSON.stringify(data));
      hashconnectInfo.value = data;
    }
    return metadata;
  });
  return { pairingString, pairCompleted };
}

export function closeWallet(): void {
  if (!client) {
    throw new Error("Hash Connect has not been initialized.");
  }
  const data = hashconnectInfo.value;
  if (data.pairedWallet) {
    data.topic = crypto.randomUUID();
    data.secret = crypto.randomUUID();
    data.pairedWallet = undefined;
    localStorage.setItem(HASHCONNECT_KEY, JSON.stringify(data));
    client = new HashConnectClient();
    client.connect(data.topic, data.secret);
  }
}

export async function submitHcsMessage(
  topic: string,
  payload: string
): Promise<TransactionResponse> {
  if (!client) {
    throw new Error("Hash Connect has not been initialized.");
  }
  const data = hashconnectInfo.value;
  const submitMessageBody = ConsensusSubmitMessageTransactionBody.fromPartial({
    topicID: topicId(topic),
    message: new TextEncoder().encode(payload),
  });
  const transaction = Transaction.encode(
    Transaction.fromPartial({
      signedTransactionBytes: SignedTransaction.encode({
        bodyBytes: TransactionBody.encode(
          TransactionBody.fromPartial({
            transactionID: {
              accountID: addressId(data.pairedWallet!.accountIds[0]),
              transactionValidStart: clockTimestamp(),
              scheduled: false,
              nonce: 0,
            },
            nodeAccountID: addressId("0.0.3"),
            transactionFee: 1_00_000_000,
            transactionValidDuration: { seconds: 120 },
            memo: "",
            data: {
              $case: "consensusSubmitMessage",
              consensusSubmitMessage: submitMessageBody,
            },
          })
        ).finish(),
        sigMap: SignatureMap.fromPartial({}),
      }).finish(),
    })
  ).finish();
  const response = await client.sendTransaction(
    data.topic!,
    transaction,
    data.pairedWallet!.accountIds[0],
    false
  );
  return response;
}

function clockTimestamp() {
  const miliseconds = Date.now();
  const seconds = ~~(miliseconds / 1_000);
  const nanos = (miliseconds % 1000) * 1_000_000;
  return { seconds, nanos };
}

function entityId(value: string) {
  const [shardAsString, realmAsString, numAsString] = value.split(".");
  const shardNum = parseInt(shardAsString, 10);
  const realmNum = parseInt(realmAsString, 10);
  const entityNum = parseInt(numAsString, 10);
  return { shardNum, realmNum, entityNum };
}

function topicId(value: string) {
  const { shardNum, realmNum, entityNum: topicNum } = entityId(value);
  return TopicID.fromPartial({ shardNum, realmNum, topicNum });
}

function addressId(value: string) {
  const { shardNum, realmNum, entityNum: accountNum } = entityId(value);
  return AccountID.fromPartial({
    shardNum,
    realmNum,
    account: { $case: "accountNum", accountNum },
  });
}
