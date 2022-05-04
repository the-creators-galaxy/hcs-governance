/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { TransactionBody } from "./transaction_body";
import { SignatureList, SignatureMap } from "./basic_types";

export const protobufPackage = "proto";

/**
 * A single signed transaction, including all its signatures. The SignatureList will have a
 * Signature for each Key in the transaction, either explicit or implicit, in the order that they
 * appear in the transaction. For example, a CryptoTransfer will first have a Signature
 * corresponding to the Key for the paying account, followed by a Signature corresponding to the Key
 * for each account that is sending or receiving cryptocurrency in the transfer. Each Transaction
 * should not have more than 50 levels.
 * The SignatureList field is deprecated and succeeded by SignatureMap.
 */
export interface Transaction {
  /**
   * the body of the transaction, which needs to be signed
   *
   * @deprecated
   */
  body: TransactionBody | undefined;
  /**
   * The signatures on the body, to authorize the transaction; deprecated and to be succeeded by
   * SignatureMap field
   *
   * @deprecated
   */
  sigs: SignatureList | undefined;
  /**
   * The signatures on the body with the new format, to authorize the transaction
   *
   * @deprecated
   */
  sigMap: SignatureMap | undefined;
  /**
   * TransactionBody serialized into bytes, which needs to be signed
   *
   * @deprecated
   */
  bodyBytes: Uint8Array;
  /** SignedTransaction serialized into bytes */
  signedTransactionBytes: Uint8Array;
}

function createBaseTransaction(): Transaction {
  return {
    body: undefined,
    sigs: undefined,
    sigMap: undefined,
    bodyBytes: new Uint8Array(),
    signedTransactionBytes: new Uint8Array(),
  };
}

export const Transaction = {
  encode(
    message: Transaction,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.body !== undefined) {
      TransactionBody.encode(message.body, writer.uint32(10).fork()).ldelim();
    }
    if (message.sigs !== undefined) {
      SignatureList.encode(message.sigs, writer.uint32(18).fork()).ldelim();
    }
    if (message.sigMap !== undefined) {
      SignatureMap.encode(message.sigMap, writer.uint32(26).fork()).ldelim();
    }
    if (message.bodyBytes.length !== 0) {
      writer.uint32(34).bytes(message.bodyBytes);
    }
    if (message.signedTransactionBytes.length !== 0) {
      writer.uint32(42).bytes(message.signedTransactionBytes);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Transaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.body = TransactionBody.decode(reader, reader.uint32());
          break;
        case 2:
          message.sigs = SignatureList.decode(reader, reader.uint32());
          break;
        case 3:
          message.sigMap = SignatureMap.decode(reader, reader.uint32());
          break;
        case 4:
          message.bodyBytes = reader.bytes();
          break;
        case 5:
          message.signedTransactionBytes = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Transaction {
    return {
      body: isSet(object.body)
        ? TransactionBody.fromJSON(object.body)
        : undefined,
      sigs: isSet(object.sigs)
        ? SignatureList.fromJSON(object.sigs)
        : undefined,
      sigMap: isSet(object.sigMap)
        ? SignatureMap.fromJSON(object.sigMap)
        : undefined,
      bodyBytes: isSet(object.bodyBytes)
        ? bytesFromBase64(object.bodyBytes)
        : new Uint8Array(),
      signedTransactionBytes: isSet(object.signedTransactionBytes)
        ? bytesFromBase64(object.signedTransactionBytes)
        : new Uint8Array(),
    };
  },

  toJSON(message: Transaction): unknown {
    const obj: any = {};
    message.body !== undefined &&
      (obj.body = message.body
        ? TransactionBody.toJSON(message.body)
        : undefined);
    message.sigs !== undefined &&
      (obj.sigs = message.sigs
        ? SignatureList.toJSON(message.sigs)
        : undefined);
    message.sigMap !== undefined &&
      (obj.sigMap = message.sigMap
        ? SignatureMap.toJSON(message.sigMap)
        : undefined);
    message.bodyBytes !== undefined &&
      (obj.bodyBytes = base64FromBytes(
        message.bodyBytes !== undefined ? message.bodyBytes : new Uint8Array()
      ));
    message.signedTransactionBytes !== undefined &&
      (obj.signedTransactionBytes = base64FromBytes(
        message.signedTransactionBytes !== undefined
          ? message.signedTransactionBytes
          : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<Transaction>): Transaction {
    const message = createBaseTransaction();
    message.body =
      object.body !== undefined && object.body !== null
        ? TransactionBody.fromPartial(object.body)
        : undefined;
    message.sigs =
      object.sigs !== undefined && object.sigs !== null
        ? SignatureList.fromPartial(object.sigs)
        : undefined;
    message.sigMap =
      object.sigMap !== undefined && object.sigMap !== null
        ? SignatureMap.fromPartial(object.sigMap)
        : undefined;
    message.bodyBytes = object.bodyBytes ?? new Uint8Array();
    message.signedTransactionBytes =
      object.signedTransactionBytes ?? new Uint8Array();
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
