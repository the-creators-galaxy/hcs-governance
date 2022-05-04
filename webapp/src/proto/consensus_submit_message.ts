/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { TransactionID, TopicID } from "./basic_types";

export const protobufPackage = "proto";

/** UNDOCUMENTED */
export interface ConsensusMessageChunkInfo {
  /** TransactionID of the first chunk, gets copied to every subsequent chunk in a fragmented message. */
  initialTransactionID: TransactionID | undefined;
  /** The total number of chunks in the message. */
  total: number;
  /** The sequence number (from 1 to total) of the current chunk in the message. */
  number: number;
}

/** UNDOCUMENTED */
export interface ConsensusSubmitMessageTransactionBody {
  /** Topic to submit message to. */
  topicID: TopicID | undefined;
  /** Message to be submitted. Max size of the Transaction (including signatures) is 6KiB. */
  message: Uint8Array;
  /** Optional information of the current chunk in a fragmented message. */
  chunkInfo: ConsensusMessageChunkInfo | undefined;
}

function createBaseConsensusMessageChunkInfo(): ConsensusMessageChunkInfo {
  return { initialTransactionID: undefined, total: 0, number: 0 };
}

export const ConsensusMessageChunkInfo = {
  encode(
    message: ConsensusMessageChunkInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.initialTransactionID !== undefined) {
      TransactionID.encode(
        message.initialTransactionID,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.total !== 0) {
      writer.uint32(16).int32(message.total);
    }
    if (message.number !== 0) {
      writer.uint32(24).int32(message.number);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConsensusMessageChunkInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsensusMessageChunkInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.initialTransactionID = TransactionID.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.total = reader.int32();
          break;
        case 3:
          message.number = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConsensusMessageChunkInfo {
    return {
      initialTransactionID: isSet(object.initialTransactionID)
        ? TransactionID.fromJSON(object.initialTransactionID)
        : undefined,
      total: isSet(object.total) ? Number(object.total) : 0,
      number: isSet(object.number) ? Number(object.number) : 0,
    };
  },

  toJSON(message: ConsensusMessageChunkInfo): unknown {
    const obj: any = {};
    message.initialTransactionID !== undefined &&
      (obj.initialTransactionID = message.initialTransactionID
        ? TransactionID.toJSON(message.initialTransactionID)
        : undefined);
    message.total !== undefined && (obj.total = Math.round(message.total));
    message.number !== undefined && (obj.number = Math.round(message.number));
    return obj;
  },

  fromPartial(
    object: DeepPartial<ConsensusMessageChunkInfo>
  ): ConsensusMessageChunkInfo {
    const message = createBaseConsensusMessageChunkInfo();
    message.initialTransactionID =
      object.initialTransactionID !== undefined &&
      object.initialTransactionID !== null
        ? TransactionID.fromPartial(object.initialTransactionID)
        : undefined;
    message.total = object.total ?? 0;
    message.number = object.number ?? 0;
    return message;
  },
};

function createBaseConsensusSubmitMessageTransactionBody(): ConsensusSubmitMessageTransactionBody {
  return {
    topicID: undefined,
    message: new Uint8Array(),
    chunkInfo: undefined,
  };
}

export const ConsensusSubmitMessageTransactionBody = {
  encode(
    message: ConsensusSubmitMessageTransactionBody,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.topicID !== undefined) {
      TopicID.encode(message.topicID, writer.uint32(10).fork()).ldelim();
    }
    if (message.message.length !== 0) {
      writer.uint32(18).bytes(message.message);
    }
    if (message.chunkInfo !== undefined) {
      ConsensusMessageChunkInfo.encode(
        message.chunkInfo,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConsensusSubmitMessageTransactionBody {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsensusSubmitMessageTransactionBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.topicID = TopicID.decode(reader, reader.uint32());
          break;
        case 2:
          message.message = reader.bytes();
          break;
        case 3:
          message.chunkInfo = ConsensusMessageChunkInfo.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConsensusSubmitMessageTransactionBody {
    return {
      topicID: isSet(object.topicID)
        ? TopicID.fromJSON(object.topicID)
        : undefined,
      message: isSet(object.message)
        ? bytesFromBase64(object.message)
        : new Uint8Array(),
      chunkInfo: isSet(object.chunkInfo)
        ? ConsensusMessageChunkInfo.fromJSON(object.chunkInfo)
        : undefined,
    };
  },

  toJSON(message: ConsensusSubmitMessageTransactionBody): unknown {
    const obj: any = {};
    message.topicID !== undefined &&
      (obj.topicID = message.topicID
        ? TopicID.toJSON(message.topicID)
        : undefined);
    message.message !== undefined &&
      (obj.message = base64FromBytes(
        message.message !== undefined ? message.message : new Uint8Array()
      ));
    message.chunkInfo !== undefined &&
      (obj.chunkInfo = message.chunkInfo
        ? ConsensusMessageChunkInfo.toJSON(message.chunkInfo)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ConsensusSubmitMessageTransactionBody>
  ): ConsensusSubmitMessageTransactionBody {
    const message = createBaseConsensusSubmitMessageTransactionBody();
    message.topicID =
      object.topicID !== undefined && object.topicID !== null
        ? TopicID.fromPartial(object.topicID)
        : undefined;
    message.message = object.message ?? new Uint8Array();
    message.chunkInfo =
      object.chunkInfo !== undefined && object.chunkInfo !== null
        ? ConsensusMessageChunkInfo.fromPartial(object.chunkInfo)
        : undefined;
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

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
