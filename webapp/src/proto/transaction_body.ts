/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { TransactionID, AccountID } from "./basic_types";
import { Duration } from "./duration";
import { ConsensusSubmitMessageTransactionBody } from "./consensus_submit_message";

export const protobufPackage = "proto";

/** A single transaction. All transaction types are possible here. */
export interface TransactionBody {
  /**
   * The ID for this transaction, which includes the payer's account (the account paying the
   * transaction fee). If two transactions have the same transactionID, they won't both have an
   * effect
   */
  transactionID: TransactionID | undefined;
  /** The account of the node that submits the client's transaction to the network */
  nodeAccountID: AccountID | undefined;
  /** The maximum transaction fee the client is willing to pay */
  transactionFee: number;
  /**
   * The transaction is invalid if consensusTimestamp > transactionID.transactionValidStart +
   * transactionValidDuration
   */
  transactionValidDuration: Duration | undefined;
  /**
   * Should a record of this transaction be generated? (A receipt is always generated, but the
   * record is optional)
   *
   * @deprecated
   */
  generateRecord: boolean;
  /** Any notes or descriptions that should be put into the record (max length 100) */
  memo: string;
  data?:
    | {
        $case: "consensusSubmitMessage";
        consensusSubmitMessage: ConsensusSubmitMessageTransactionBody;
      }
}

function createBaseTransactionBody(): TransactionBody {
  return {
    transactionID: undefined,
    nodeAccountID: undefined,
    transactionFee: 0,
    transactionValidDuration: undefined,
    generateRecord: false,
    memo: "",
    data: undefined,
  };
}

export const TransactionBody = {
  encode(
    message: TransactionBody,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.transactionID !== undefined) {
      TransactionID.encode(
        message.transactionID,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.nodeAccountID !== undefined) {
      AccountID.encode(
        message.nodeAccountID,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.transactionFee !== 0) {
      writer.uint32(24).uint64(message.transactionFee);
    }
    if (message.transactionValidDuration !== undefined) {
      Duration.encode(
        message.transactionValidDuration,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.memo !== "") {
      writer.uint32(50).string(message.memo);
    }
    if (message.data?.$case === "consensusSubmitMessage") {
      ConsensusSubmitMessageTransactionBody.encode(
        message.data.consensusSubmitMessage,
        writer.uint32(218).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionBody {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionID = TransactionID.decode(reader, reader.uint32());
          break;
        case 2:
          message.nodeAccountID = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          message.transactionFee = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.transactionValidDuration = Duration.decode(
            reader,
            reader.uint32()
          );
          break;
        case 6:
          message.memo = reader.string();
          break;
        case 27:
          message.data = {
            $case: "consensusSubmitMessage",
            consensusSubmitMessage:
              ConsensusSubmitMessageTransactionBody.decode(
                reader,
                reader.uint32()
              ),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionBody {
    return {
      transactionID: isSet(object.transactionID)
        ? TransactionID.fromJSON(object.transactionID)
        : undefined,
      nodeAccountID: isSet(object.nodeAccountID)
        ? AccountID.fromJSON(object.nodeAccountID)
        : undefined,
      transactionFee: isSet(object.transactionFee)
        ? Number(object.transactionFee)
        : 0,
      transactionValidDuration: isSet(object.transactionValidDuration)
        ? Duration.fromJSON(object.transactionValidDuration)
        : undefined,
      generateRecord: isSet(object.generateRecord)
        ? Boolean(object.generateRecord)
        : false,
      memo: isSet(object.memo) ? String(object.memo) : "",
      data: isSet(object.consensusSubmitMessage)
        ? {
            $case: "consensusSubmitMessage",
            consensusSubmitMessage:
              ConsensusSubmitMessageTransactionBody.fromJSON(
                object.consensusSubmitMessage
              ),
          }
        : undefined,
    };
  },

  toJSON(message: TransactionBody): unknown {
    const obj: any = {};
    message.transactionID !== undefined &&
      (obj.transactionID = message.transactionID
        ? TransactionID.toJSON(message.transactionID)
        : undefined);
    message.nodeAccountID !== undefined &&
      (obj.nodeAccountID = message.nodeAccountID
        ? AccountID.toJSON(message.nodeAccountID)
        : undefined);
    message.transactionFee !== undefined &&
      (obj.transactionFee = Math.round(message.transactionFee));
    message.transactionValidDuration !== undefined &&
      (obj.transactionValidDuration = message.transactionValidDuration
        ? Duration.toJSON(message.transactionValidDuration)
        : undefined);
    message.memo !== undefined && (obj.memo = message.memo);
    message.data?.$case === "consensusSubmitMessage" &&
      (obj.consensusSubmitMessage = message.data?.consensusSubmitMessage
        ? ConsensusSubmitMessageTransactionBody.toJSON(
            message.data?.consensusSubmitMessage
          )
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TransactionBody>): TransactionBody {
    const message = createBaseTransactionBody();
    message.transactionID =
      object.transactionID !== undefined && object.transactionID !== null
        ? TransactionID.fromPartial(object.transactionID)
        : undefined;
    message.nodeAccountID =
      object.nodeAccountID !== undefined && object.nodeAccountID !== null
        ? AccountID.fromPartial(object.nodeAccountID)
        : undefined;
    message.transactionFee = object.transactionFee ?? 0;
    message.transactionValidDuration =
      object.transactionValidDuration !== undefined &&
      object.transactionValidDuration !== null
        ? Duration.fromPartial(object.transactionValidDuration)
        : undefined;
    message.memo = object.memo ?? "";
    if (
      object.data?.$case === "consensusSubmitMessage" &&
      object.data?.consensusSubmitMessage !== undefined &&
      object.data?.consensusSubmitMessage !== null
    ) {
      message.data = {
        $case: "consensusSubmitMessage",
        consensusSubmitMessage:
          ConsensusSubmitMessageTransactionBody.fromPartial(
            object.data.consensusSubmitMessage
          ),
      };
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string }
  ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & {
      $case: T["$case"];
    }
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}