import {
  HashConnectCachedClient,
  type TransactionResponse,
  type WalletMetadata,
} from "@bugbytes/hapi-connect";
import {
  ConsensusSubmitMessageTransactionBody,
  SignatureMap,
  SignedTransaction,
  Transaction,
  TransactionBody,
} from "@bugbytes/hapi-proto";
import {
  clockTimestamp,
  keyString_to_accountID,
  keyString_to_topicID,
  type EntityIdKeyString,
} from "@bugbytes/hapi-util";
import { ref } from "vue";
import { network } from "./info";

const client = new HashConnectCachedClient("tcg.hcs.governance.hashconnect");

export const pairedWallet = ref<WalletMetadata | undefined>(
  client.pairedWallet
);

export function openHashconnectPairRequest(): string {
  client.closeWallet();
  const networkName =
    network.value.network.toLowerCase() == "mainnet" ? "mainnet" : "testnet";
  const req = client.openPairRequest(
    "TCG Governance",
    "TCG Governance App",
    networkName
  );
  req.pairCompleted.then((w) => (pairedWallet.value = w));
  return req.pairingString;
}

export function closeHashconnectWallet() {
  client.closeWallet();
  pairedWallet.value = undefined;
}

export async function submitHcsMessage(
  topic: EntityIdKeyString,
  payload: string
): Promise<TransactionResponse> {
  if (!client.pairedWallet) {
    throw new Error("Not connected to any wallet.");
  }
  const submitMessageBody = ConsensusSubmitMessageTransactionBody.fromPartial({
    topicID: keyString_to_topicID(topic),
    message: new TextEncoder().encode(payload),
  });
  const transaction = Transaction.encode(
    Transaction.fromPartial({
      signedTransactionBytes: SignedTransaction.encode({
        bodyBytes: TransactionBody.encode(
          TransactionBody.fromPartial({
            transactionID: {
              accountID: keyString_to_accountID(
                client.pairedWallet.accountIds[0]
              ),
              transactionValidStart: clockTimestamp(),
              scheduled: false,
              nonce: 0,
            },
            // TODO: need functionality to pick a reasonable node.
            nodeAccountID: keyString_to_accountID("0.0.3"),
            // TODO: need functionality to compute a reasonable max tx fee.
            transactionFee: 1_00_000_000,
            transactionValidDuration: { seconds: 180 },
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
  const response = await client.sendTransaction(transaction, false);
  return response;
}
