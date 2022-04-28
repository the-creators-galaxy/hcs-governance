import { createEmitter } from "ts-typed-events";
import SimpleCrypto from "simple-crypto-js";
import * as base64 from "@protobufjs/base64";
declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}
declare type Handler = (value: RelayMessage) => boolean;

export class HashConnectClient {
  private readonly relay: Relay;
  private topics = new Map<string, string>();
  private pending: Handler[] = [];

  constructor(relay = new Relay()) {
    this.relay = relay;
    this.relay.connected.on(() => {
      for (const topic of this.topics.keys()) {
        this.relay.send(JSON.stringify({ action: "sub", topic: topic }));
      }
    });
    this.relay.received.on((payload) => {
      if (payload) {
        const { timestamp, type, data, topic } = JSON.parse(
          JSON.parse(payload)
        );
        const secret = this.topics.get(topic);
        if (secret) {
          const decryptedData = new SimpleCrypto(secret).decrypt(data);
          const message = { timestamp, type, data: decryptedData, topic };
          for (let i = 0; i < this.pending.length; i++) {
            if (this.pending[i](message)) {
              this.pending.splice(i, 1);
              break;
            }
          }
          // Remove this section of code when we're sure we don't need it.
          // Not sure if its necessary, and sometimes causes an ACK storm.
          // this.send(topic, 'Acknowledge', {
          //     result: handeled,
          //     topic: topic,
          //     msg_id: (decryptedData as any).id
          // });
        }
      }
    });
  }

  connect(topic: string, secret: string) {
    this.topics.set(topic, secret);
    if (this.relay.isOpen) {
      this.relay.send(JSON.stringify({ action: "sub", topic: topic }));
    }
  }

  sendTransaction(
    topic: string,
    transaction: Uint8Array,
    accountToSign: string,
    returnTransaction = false
  ): Promise<TransactionResponse> {
    const id = crypto.randomUUID();
    this.send(topic, "Transaction", {
      id,
      topic,
      byteArray: base64.encode(transaction, 0, transaction.length),
      metadata: { accountToSign, returnTransaction },
    });
    return new Promise<TransactionResponse>((resolve) => {
      const handler = (message: RelayMessage) => {
        // Note Potential Bug: We have no correlation ID in the protocol
        // to discern if this is really the response paired with the
        // request we sent to the remote wallet.  So we assume the first
        // handler in the list with the topic will get the response.
        if (message.type === "TransactionResponse" && message.topic === topic) {
          setTimeout(() => resolve(message.data), 0);
          return true;
        }
        return false;
      };
      this.pending.push(handler);
    });
  }

  requestAdditionalAccounts(
    topic: string,
    network: string,
    multiAccount: boolean
  ): Promise<AdditionalAccountResponse> {
    const id = crypto.randomUUID();
    this.send(topic, "AdditionalAccountRequest", {
      id,
      topic,
      network,
      multiAccount,
    });
    return new Promise<AdditionalAccountResponse>((resolve) => {
      const handler = (message: RelayMessage) => {
        // Note Potential Bug: We have no correlation ID in the protocol
        // to discern if this is really the response paired with the
        // request we sent to the remote wallet.  So we assume the first
        // handler in the list with the topic will get the response.
        if (
          message.type === "AdditionalAccountResponse" &&
          message.topic === topic
        ) {
          setTimeout(() => resolve(message.data), 0);
          return true;
        }
        return false;
      };
      this.pending.push(handler);
    });
  }

  waitForPairing(topic: string): Promise<WalletMetadata> {
    return new Promise<WalletMetadata>((resolve) => {
      const handler = (message: RelayMessage) => {
        if (message.type === "ApprovePairing" && message.topic === topic) {
          setTimeout(() => resolve(message.data), 0);
          return true;
        }
        return false;
      };
      this.pending.push(handler);
    });
  }

  private send(topic: string, type: string, payload: any) {
    const timestamp = Date.now();
    const data = new SimpleCrypto(this.topics.get(topic)).encrypt(
      JSON.stringify(payload)
    );
    this.relay.send(
      JSON.stringify({
        action: "pub",
        payload: JSON.stringify(
          JSON.stringify({ timestamp, type, data, topic })
        ),
        topic,
      })
    );
  }
}

export class Relay {
  private readonly url: string;
  private socket!: WebSocket;
  private readonly emitConnected = createEmitter();
  private readonly emitDisconnected = createEmitter();
  private readonly emitReceived = createEmitter<string>();
  public readonly received = this.emitReceived.event;
  public readonly connected = this.emitConnected.event;
  public readonly disconnected = this.emitDisconnected.event;
  public get isOpen() {
    return this.socket.readyState === WebSocket.OPEN;
  }

  constructor(url = "wss://hashconnect.hashpack.app") {
    this.url = url;
    this.connect();
  }

  send(message: string): void {
    this.socket.send(message);
  }

  private connect() {
    const socket = new WebSocket(this.url);
    socket.onopen = this.onOpen.bind(this);
    socket.onmessage = this.onMessage.bind(this);
    socket.onerror = this.onError.bind(this);
    socket.onclose = this.onClose.bind(this);
    this.socket = socket;
  }

  private onOpen() {
    this.emitConnected();
  }

  private onMessage(message: any) {
    this.emitReceived(message.data);
  }

  private onClose() {
    this.emitDisconnected();
    this.socket.onopen = null;
    this.socket.onmessage = null;
    this.socket.onerror = null;
    this.socket.onclose = null;
    this.connect();
  }

  private onError(err: any) {
    console.error(err);
  }
}

export function createParingString(
  topic: string,
  secret: string,
  name: string,
  description: string,
  network: "testnet" | "mainnet"
): string {
  const data = new TextEncoder().encode(
    JSON.stringify({
      metadata: {
        name,
        description,
        url: "",
        icon: "",
        publicKey: secret,
      },
      topic,
      network,
      multiAccount: false,
    })
  );
  return base64.encode(data, 0, data.length);
}

export interface AdditionalAccountResponse {
  topic: string;
  id: string;
  accountIds: string[];
  network: string;
}

export interface TransactionResponse {
  topic: string;
  id: string;
  success: boolean;
  receipt: Uint8Array | undefined;
  signedTransaction: Uint8Array | undefined;
  error: any | string | undefined;
}

export interface WalletMetadata {
  accountIds: string[];
  id: string;
  metadata: {
    description: string;
    icon: string;
    name: string;
    publicKey: string;
    url: string;
  };
  network: "testnet" | "mainnet";
  secret: string;
  topic: string;
}

interface RelayMessage {
  timestamp: number;
  type: string;
  data: any;
  topic: string;
}
