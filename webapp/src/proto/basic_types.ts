/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Timestamp, TimestampSeconds } from "./timestamp";
import { UInt32Value, BoolValue } from "./google/protobuf/wrappers";

export const protobufPackage = "proto";

/**
 * Possible Token Types (IWA Compatibility).
 * Apart from fungible and non-fungible, Tokens can have either a common or unique representation.
 * This distinction might seem subtle, but it is important when considering how tokens can be traced
 * and if they can have isolated and unique properties.
 */
export enum TokenType {
  /**
   * FUNGIBLE_COMMON - Interchangeable value with one another, where any quantity of them has the same value as
   * another equal quantity if they are in the same class.  Share a single set of properties, not
   * distinct from one another. Simply represented as a balance or quantity to a given Hedera
   * account.
   */
  FUNGIBLE_COMMON = 0,
  /**
   * NON_FUNGIBLE_UNIQUE - Unique, not interchangeable with other tokens of the same type as they typically have
   * different values.  Individually traced and can carry unique properties (e.g. serial number).
   */
  NON_FUNGIBLE_UNIQUE = 1,
  UNRECOGNIZED = -1,
}

export function tokenTypeFromJSON(object: any): TokenType {
  switch (object) {
    case 0:
    case "FUNGIBLE_COMMON":
      return TokenType.FUNGIBLE_COMMON;
    case 1:
    case "NON_FUNGIBLE_UNIQUE":
      return TokenType.NON_FUNGIBLE_UNIQUE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenType.UNRECOGNIZED;
  }
}

export function tokenTypeToJSON(object: TokenType): string {
  switch (object) {
    case TokenType.FUNGIBLE_COMMON:
      return "FUNGIBLE_COMMON";
    case TokenType.NON_FUNGIBLE_UNIQUE:
      return "NON_FUNGIBLE_UNIQUE";
    default:
      return "UNKNOWN";
  }
}

/**
 * Allows a set of resource prices to be scoped to a certain type of a HAPI operation.
 *
 * For example, the resource prices for a TokenMint operation are different between minting fungible
 * and non-fungible tokens. This enum allows us to "mark" a set of prices as applying to one or the
 * other.
 *
 * Similarly, the resource prices for a basic TokenCreate without a custom fee schedule yield a
 * total price of $1. The resource prices for a TokenCreate with a custom fee schedule are different
 * and yield a total base price of $2.
 */
export enum SubType {
  /** DEFAULT - The resource prices have no special scope */
  DEFAULT = 0,
  /** TOKEN_FUNGIBLE_COMMON - The resource prices are scoped to an operation on a fungible common token */
  TOKEN_FUNGIBLE_COMMON = 1,
  /** TOKEN_NON_FUNGIBLE_UNIQUE - The resource prices are scoped to an operation on a non-fungible unique token */
  TOKEN_NON_FUNGIBLE_UNIQUE = 2,
  /**
   * TOKEN_FUNGIBLE_COMMON_WITH_CUSTOM_FEES - The resource prices are scoped to an operation on a fungible common
   * token with a custom fee schedule
   */
  TOKEN_FUNGIBLE_COMMON_WITH_CUSTOM_FEES = 3,
  /**
   * TOKEN_NON_FUNGIBLE_UNIQUE_WITH_CUSTOM_FEES - The resource prices are scoped to an operation on a non-fungible unique
   * token with a custom fee schedule
   */
  TOKEN_NON_FUNGIBLE_UNIQUE_WITH_CUSTOM_FEES = 4,
  UNRECOGNIZED = -1,
}

export function subTypeFromJSON(object: any): SubType {
  switch (object) {
    case 0:
    case "DEFAULT":
      return SubType.DEFAULT;
    case 1:
    case "TOKEN_FUNGIBLE_COMMON":
      return SubType.TOKEN_FUNGIBLE_COMMON;
    case 2:
    case "TOKEN_NON_FUNGIBLE_UNIQUE":
      return SubType.TOKEN_NON_FUNGIBLE_UNIQUE;
    case 3:
    case "TOKEN_FUNGIBLE_COMMON_WITH_CUSTOM_FEES":
      return SubType.TOKEN_FUNGIBLE_COMMON_WITH_CUSTOM_FEES;
    case 4:
    case "TOKEN_NON_FUNGIBLE_UNIQUE_WITH_CUSTOM_FEES":
      return SubType.TOKEN_NON_FUNGIBLE_UNIQUE_WITH_CUSTOM_FEES;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SubType.UNRECOGNIZED;
  }
}

export function subTypeToJSON(object: SubType): string {
  switch (object) {
    case SubType.DEFAULT:
      return "DEFAULT";
    case SubType.TOKEN_FUNGIBLE_COMMON:
      return "TOKEN_FUNGIBLE_COMMON";
    case SubType.TOKEN_NON_FUNGIBLE_UNIQUE:
      return "TOKEN_NON_FUNGIBLE_UNIQUE";
    case SubType.TOKEN_FUNGIBLE_COMMON_WITH_CUSTOM_FEES:
      return "TOKEN_FUNGIBLE_COMMON_WITH_CUSTOM_FEES";
    case SubType.TOKEN_NON_FUNGIBLE_UNIQUE_WITH_CUSTOM_FEES:
      return "TOKEN_NON_FUNGIBLE_UNIQUE_WITH_CUSTOM_FEES";
    default:
      return "UNKNOWN";
  }
}

/**
 * Possible Token Supply Types (IWA Compatibility).
 * Indicates how many tokens can have during its lifetime.
 */
export enum TokenSupplyType {
  /** INFINITE - Indicates that tokens of that type have an upper bound of Long.MAX_VALUE. */
  INFINITE = 0,
  /**
   * FINITE - Indicates that tokens of that type have an upper bound of maxSupply,
   * provided on token creation.
   */
  FINITE = 1,
  UNRECOGNIZED = -1,
}

export function tokenSupplyTypeFromJSON(object: any): TokenSupplyType {
  switch (object) {
    case 0:
    case "INFINITE":
      return TokenSupplyType.INFINITE;
    case 1:
    case "FINITE":
      return TokenSupplyType.FINITE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenSupplyType.UNRECOGNIZED;
  }
}

export function tokenSupplyTypeToJSON(object: TokenSupplyType): string {
  switch (object) {
    case TokenSupplyType.INFINITE:
      return "INFINITE";
    case TokenSupplyType.FINITE:
      return "FINITE";
    default:
      return "UNKNOWN";
  }
}

/**
 * Possible Freeze statuses returned on TokenGetInfoQuery or CryptoGetInfoResponse in
 * TokenRelationship
 */
export enum TokenFreezeStatus {
  /** FreezeNotApplicable - UNDOCUMENTED */
  FreezeNotApplicable = 0,
  /** Frozen - UNDOCUMENTED */
  Frozen = 1,
  /** Unfrozen - UNDOCUMENTED */
  Unfrozen = 2,
  UNRECOGNIZED = -1,
}

export function tokenFreezeStatusFromJSON(object: any): TokenFreezeStatus {
  switch (object) {
    case 0:
    case "FreezeNotApplicable":
      return TokenFreezeStatus.FreezeNotApplicable;
    case 1:
    case "Frozen":
      return TokenFreezeStatus.Frozen;
    case 2:
    case "Unfrozen":
      return TokenFreezeStatus.Unfrozen;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenFreezeStatus.UNRECOGNIZED;
  }
}

export function tokenFreezeStatusToJSON(object: TokenFreezeStatus): string {
  switch (object) {
    case TokenFreezeStatus.FreezeNotApplicable:
      return "FreezeNotApplicable";
    case TokenFreezeStatus.Frozen:
      return "Frozen";
    case TokenFreezeStatus.Unfrozen:
      return "Unfrozen";
    default:
      return "UNKNOWN";
  }
}

/** Possible KYC statuses returned on TokenGetInfoQuery or CryptoGetInfoResponse in TokenRelationship */
export enum TokenKycStatus {
  /** KycNotApplicable - UNDOCUMENTED */
  KycNotApplicable = 0,
  /** Granted - UNDOCUMENTED */
  Granted = 1,
  /** Revoked - UNDOCUMENTED */
  Revoked = 2,
  UNRECOGNIZED = -1,
}

export function tokenKycStatusFromJSON(object: any): TokenKycStatus {
  switch (object) {
    case 0:
    case "KycNotApplicable":
      return TokenKycStatus.KycNotApplicable;
    case 1:
    case "Granted":
      return TokenKycStatus.Granted;
    case 2:
    case "Revoked":
      return TokenKycStatus.Revoked;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenKycStatus.UNRECOGNIZED;
  }
}

export function tokenKycStatusToJSON(object: TokenKycStatus): string {
  switch (object) {
    case TokenKycStatus.KycNotApplicable:
      return "KycNotApplicable";
    case TokenKycStatus.Granted:
      return "Granted";
    case TokenKycStatus.Revoked:
      return "Revoked";
    default:
      return "UNKNOWN";
  }
}

/** Possible Pause statuses returned on TokenGetInfoQuery */
export enum TokenPauseStatus {
  /** PauseNotApplicable - Indicates that a Token has no pauseKey */
  PauseNotApplicable = 0,
  /** Paused - Indicates that a Token is Paused */
  Paused = 1,
  /** Unpaused - Indicates that a Token is Unpaused. */
  Unpaused = 2,
  UNRECOGNIZED = -1,
}

export function tokenPauseStatusFromJSON(object: any): TokenPauseStatus {
  switch (object) {
    case 0:
    case "PauseNotApplicable":
      return TokenPauseStatus.PauseNotApplicable;
    case 1:
    case "Paused":
      return TokenPauseStatus.Paused;
    case 2:
    case "Unpaused":
      return TokenPauseStatus.Unpaused;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenPauseStatus.UNRECOGNIZED;
  }
}

export function tokenPauseStatusToJSON(object: TokenPauseStatus): string {
  switch (object) {
    case TokenPauseStatus.PauseNotApplicable:
      return "PauseNotApplicable";
    case TokenPauseStatus.Paused:
      return "Paused";
    case TokenPauseStatus.Unpaused:
      return "Unpaused";
    default:
      return "UNKNOWN";
  }
}

/** The transactions and queries supported by Hedera Hashgraph. */
export enum HederaFunctionality {
  /**
   * NONE - UNSPECIFIED - Need to keep first value as unspecified because first element is ignored and
   * not parsed (0 is ignored by parser)
   */
  NONE = 0,
  /** CryptoTransfer - crypto transfer */
  CryptoTransfer = 1,
  /** CryptoUpdate - crypto update account */
  CryptoUpdate = 2,
  /** CryptoDelete - crypto delete account */
  CryptoDelete = 3,
  /** CryptoAddLiveHash - Add a livehash to a crypto account */
  CryptoAddLiveHash = 4,
  /** CryptoDeleteLiveHash - Delete a livehash from a crypto account */
  CryptoDeleteLiveHash = 5,
  /** ContractCall - Smart Contract Call */
  ContractCall = 6,
  /** ContractCreate - Smart Contract Create Contract */
  ContractCreate = 7,
  /** ContractUpdate - Smart Contract update contract */
  ContractUpdate = 8,
  /** FileCreate - File Operation create file */
  FileCreate = 9,
  /** FileAppend - File Operation append file */
  FileAppend = 10,
  /** FileUpdate - File Operation update file */
  FileUpdate = 11,
  /** FileDelete - File Operation delete file */
  FileDelete = 12,
  /** CryptoGetAccountBalance - crypto get account balance */
  CryptoGetAccountBalance = 13,
  /** CryptoGetAccountRecords - crypto get account record */
  CryptoGetAccountRecords = 14,
  /** CryptoGetInfo - Crypto get info */
  CryptoGetInfo = 15,
  /** ContractCallLocal - Smart Contract Call */
  ContractCallLocal = 16,
  /** ContractGetInfo - Smart Contract get info */
  ContractGetInfo = 17,
  /** ContractGetBytecode - Smart Contract, get the byte code */
  ContractGetBytecode = 18,
  /** GetBySolidityID - Smart Contract, get by solidity ID */
  GetBySolidityID = 19,
  /** GetByKey - Smart Contract, get by key */
  GetByKey = 20,
  /** CryptoGetLiveHash - Get a live hash from a crypto account */
  CryptoGetLiveHash = 21,
  /** CryptoGetStakers - Crypto, get the stakers for the node */
  CryptoGetStakers = 22,
  /** FileGetContents - File Operations get file contents */
  FileGetContents = 23,
  /** FileGetInfo - File Operations get the info of the file */
  FileGetInfo = 24,
  /** TransactionGetRecord - Crypto get the transaction records */
  TransactionGetRecord = 25,
  /** ContractGetRecords - Contract get the transaction records */
  ContractGetRecords = 26,
  /** CryptoCreate - crypto create account */
  CryptoCreate = 27,
  /** SystemDelete - system delete file */
  SystemDelete = 28,
  /** SystemUndelete - system undelete file */
  SystemUndelete = 29,
  /** ContractDelete - delete contract */
  ContractDelete = 30,
  /** Freeze - freeze */
  Freeze = 31,
  /** CreateTransactionRecord - Create Tx Record */
  CreateTransactionRecord = 32,
  /** CryptoAccountAutoRenew - Crypto Auto Renew */
  CryptoAccountAutoRenew = 33,
  /** ContractAutoRenew - Contract Auto Renew */
  ContractAutoRenew = 34,
  /** GetVersionInfo - Get Version */
  GetVersionInfo = 35,
  /** TransactionGetReceipt - Transaction Get Receipt */
  TransactionGetReceipt = 36,
  /** ConsensusCreateTopic - Create Topic */
  ConsensusCreateTopic = 50,
  /** ConsensusUpdateTopic - Update Topic */
  ConsensusUpdateTopic = 51,
  /** ConsensusDeleteTopic - Delete Topic */
  ConsensusDeleteTopic = 52,
  /** ConsensusGetTopicInfo - Get Topic information */
  ConsensusGetTopicInfo = 53,
  /** ConsensusSubmitMessage - Submit message to topic */
  ConsensusSubmitMessage = 54,
  UncheckedSubmit = 55,
  /** TokenCreate - Create Token */
  TokenCreate = 56,
  /** TokenGetInfo - Get Token information */
  TokenGetInfo = 58,
  /** TokenFreezeAccount - Freeze Account */
  TokenFreezeAccount = 59,
  /** TokenUnfreezeAccount - Unfreeze Account */
  TokenUnfreezeAccount = 60,
  /** TokenGrantKycToAccount - Grant KYC to Account */
  TokenGrantKycToAccount = 61,
  /** TokenRevokeKycFromAccount - Revoke KYC from Account */
  TokenRevokeKycFromAccount = 62,
  /** TokenDelete - Delete Token */
  TokenDelete = 63,
  /** TokenUpdate - Update Token */
  TokenUpdate = 64,
  /** TokenMint - Mint tokens to treasury */
  TokenMint = 65,
  /** TokenBurn - Burn tokens from treasury */
  TokenBurn = 66,
  /** TokenAccountWipe - Wipe token amount from Account holder */
  TokenAccountWipe = 67,
  /** TokenAssociateToAccount - Associate tokens to an account */
  TokenAssociateToAccount = 68,
  /** TokenDissociateFromAccount - Dissociate tokens from an account */
  TokenDissociateFromAccount = 69,
  /** ScheduleCreate - Create Scheduled Transaction */
  ScheduleCreate = 70,
  /** ScheduleDelete - Delete Scheduled Transaction */
  ScheduleDelete = 71,
  /** ScheduleSign - Sign Scheduled Transaction */
  ScheduleSign = 72,
  /** ScheduleGetInfo - Get Scheduled Transaction Information */
  ScheduleGetInfo = 73,
  /** TokenGetAccountNftInfos - Get Token Account Nft Information */
  TokenGetAccountNftInfos = 74,
  /** TokenGetNftInfo - Get Token Nft Information */
  TokenGetNftInfo = 75,
  /** TokenGetNftInfos - Get Token Nft List Information */
  TokenGetNftInfos = 76,
  /** TokenFeeScheduleUpdate - Update a token's custom fee schedule, if permissible */
  TokenFeeScheduleUpdate = 77,
  /** NetworkGetExecutionTime - Get execution time(s) by TransactionID, if available */
  NetworkGetExecutionTime = 78,
  /** TokenPause - Pause the Token */
  TokenPause = 79,
  /** TokenUnpause - Unpause the Token */
  TokenUnpause = 80,
  /** CryptoApproveAllowance - Approve allowance for a spender relative to the payer account */
  CryptoApproveAllowance = 81,
  /** CryptoAdjustAllowance - Adjust allowances for a spender relative to the payer account */
  CryptoAdjustAllowance = 82,
  UNRECOGNIZED = -1,
}

export function hederaFunctionalityFromJSON(object: any): HederaFunctionality {
  switch (object) {
    case 0:
    case "NONE":
      return HederaFunctionality.NONE;
    case 1:
    case "CryptoTransfer":
      return HederaFunctionality.CryptoTransfer;
    case 2:
    case "CryptoUpdate":
      return HederaFunctionality.CryptoUpdate;
    case 3:
    case "CryptoDelete":
      return HederaFunctionality.CryptoDelete;
    case 4:
    case "CryptoAddLiveHash":
      return HederaFunctionality.CryptoAddLiveHash;
    case 5:
    case "CryptoDeleteLiveHash":
      return HederaFunctionality.CryptoDeleteLiveHash;
    case 6:
    case "ContractCall":
      return HederaFunctionality.ContractCall;
    case 7:
    case "ContractCreate":
      return HederaFunctionality.ContractCreate;
    case 8:
    case "ContractUpdate":
      return HederaFunctionality.ContractUpdate;
    case 9:
    case "FileCreate":
      return HederaFunctionality.FileCreate;
    case 10:
    case "FileAppend":
      return HederaFunctionality.FileAppend;
    case 11:
    case "FileUpdate":
      return HederaFunctionality.FileUpdate;
    case 12:
    case "FileDelete":
      return HederaFunctionality.FileDelete;
    case 13:
    case "CryptoGetAccountBalance":
      return HederaFunctionality.CryptoGetAccountBalance;
    case 14:
    case "CryptoGetAccountRecords":
      return HederaFunctionality.CryptoGetAccountRecords;
    case 15:
    case "CryptoGetInfo":
      return HederaFunctionality.CryptoGetInfo;
    case 16:
    case "ContractCallLocal":
      return HederaFunctionality.ContractCallLocal;
    case 17:
    case "ContractGetInfo":
      return HederaFunctionality.ContractGetInfo;
    case 18:
    case "ContractGetBytecode":
      return HederaFunctionality.ContractGetBytecode;
    case 19:
    case "GetBySolidityID":
      return HederaFunctionality.GetBySolidityID;
    case 20:
    case "GetByKey":
      return HederaFunctionality.GetByKey;
    case 21:
    case "CryptoGetLiveHash":
      return HederaFunctionality.CryptoGetLiveHash;
    case 22:
    case "CryptoGetStakers":
      return HederaFunctionality.CryptoGetStakers;
    case 23:
    case "FileGetContents":
      return HederaFunctionality.FileGetContents;
    case 24:
    case "FileGetInfo":
      return HederaFunctionality.FileGetInfo;
    case 25:
    case "TransactionGetRecord":
      return HederaFunctionality.TransactionGetRecord;
    case 26:
    case "ContractGetRecords":
      return HederaFunctionality.ContractGetRecords;
    case 27:
    case "CryptoCreate":
      return HederaFunctionality.CryptoCreate;
    case 28:
    case "SystemDelete":
      return HederaFunctionality.SystemDelete;
    case 29:
    case "SystemUndelete":
      return HederaFunctionality.SystemUndelete;
    case 30:
    case "ContractDelete":
      return HederaFunctionality.ContractDelete;
    case 31:
    case "Freeze":
      return HederaFunctionality.Freeze;
    case 32:
    case "CreateTransactionRecord":
      return HederaFunctionality.CreateTransactionRecord;
    case 33:
    case "CryptoAccountAutoRenew":
      return HederaFunctionality.CryptoAccountAutoRenew;
    case 34:
    case "ContractAutoRenew":
      return HederaFunctionality.ContractAutoRenew;
    case 35:
    case "GetVersionInfo":
      return HederaFunctionality.GetVersionInfo;
    case 36:
    case "TransactionGetReceipt":
      return HederaFunctionality.TransactionGetReceipt;
    case 50:
    case "ConsensusCreateTopic":
      return HederaFunctionality.ConsensusCreateTopic;
    case 51:
    case "ConsensusUpdateTopic":
      return HederaFunctionality.ConsensusUpdateTopic;
    case 52:
    case "ConsensusDeleteTopic":
      return HederaFunctionality.ConsensusDeleteTopic;
    case 53:
    case "ConsensusGetTopicInfo":
      return HederaFunctionality.ConsensusGetTopicInfo;
    case 54:
    case "ConsensusSubmitMessage":
      return HederaFunctionality.ConsensusSubmitMessage;
    case 55:
    case "UncheckedSubmit":
      return HederaFunctionality.UncheckedSubmit;
    case 56:
    case "TokenCreate":
      return HederaFunctionality.TokenCreate;
    case 58:
    case "TokenGetInfo":
      return HederaFunctionality.TokenGetInfo;
    case 59:
    case "TokenFreezeAccount":
      return HederaFunctionality.TokenFreezeAccount;
    case 60:
    case "TokenUnfreezeAccount":
      return HederaFunctionality.TokenUnfreezeAccount;
    case 61:
    case "TokenGrantKycToAccount":
      return HederaFunctionality.TokenGrantKycToAccount;
    case 62:
    case "TokenRevokeKycFromAccount":
      return HederaFunctionality.TokenRevokeKycFromAccount;
    case 63:
    case "TokenDelete":
      return HederaFunctionality.TokenDelete;
    case 64:
    case "TokenUpdate":
      return HederaFunctionality.TokenUpdate;
    case 65:
    case "TokenMint":
      return HederaFunctionality.TokenMint;
    case 66:
    case "TokenBurn":
      return HederaFunctionality.TokenBurn;
    case 67:
    case "TokenAccountWipe":
      return HederaFunctionality.TokenAccountWipe;
    case 68:
    case "TokenAssociateToAccount":
      return HederaFunctionality.TokenAssociateToAccount;
    case 69:
    case "TokenDissociateFromAccount":
      return HederaFunctionality.TokenDissociateFromAccount;
    case 70:
    case "ScheduleCreate":
      return HederaFunctionality.ScheduleCreate;
    case 71:
    case "ScheduleDelete":
      return HederaFunctionality.ScheduleDelete;
    case 72:
    case "ScheduleSign":
      return HederaFunctionality.ScheduleSign;
    case 73:
    case "ScheduleGetInfo":
      return HederaFunctionality.ScheduleGetInfo;
    case 74:
    case "TokenGetAccountNftInfos":
      return HederaFunctionality.TokenGetAccountNftInfos;
    case 75:
    case "TokenGetNftInfo":
      return HederaFunctionality.TokenGetNftInfo;
    case 76:
    case "TokenGetNftInfos":
      return HederaFunctionality.TokenGetNftInfos;
    case 77:
    case "TokenFeeScheduleUpdate":
      return HederaFunctionality.TokenFeeScheduleUpdate;
    case 78:
    case "NetworkGetExecutionTime":
      return HederaFunctionality.NetworkGetExecutionTime;
    case 79:
    case "TokenPause":
      return HederaFunctionality.TokenPause;
    case 80:
    case "TokenUnpause":
      return HederaFunctionality.TokenUnpause;
    case 81:
    case "CryptoApproveAllowance":
      return HederaFunctionality.CryptoApproveAllowance;
    case 82:
    case "CryptoAdjustAllowance":
      return HederaFunctionality.CryptoAdjustAllowance;
    case -1:
    case "UNRECOGNIZED":
    default:
      return HederaFunctionality.UNRECOGNIZED;
  }
}

export function hederaFunctionalityToJSON(object: HederaFunctionality): string {
  switch (object) {
    case HederaFunctionality.NONE:
      return "NONE";
    case HederaFunctionality.CryptoTransfer:
      return "CryptoTransfer";
    case HederaFunctionality.CryptoUpdate:
      return "CryptoUpdate";
    case HederaFunctionality.CryptoDelete:
      return "CryptoDelete";
    case HederaFunctionality.CryptoAddLiveHash:
      return "CryptoAddLiveHash";
    case HederaFunctionality.CryptoDeleteLiveHash:
      return "CryptoDeleteLiveHash";
    case HederaFunctionality.ContractCall:
      return "ContractCall";
    case HederaFunctionality.ContractCreate:
      return "ContractCreate";
    case HederaFunctionality.ContractUpdate:
      return "ContractUpdate";
    case HederaFunctionality.FileCreate:
      return "FileCreate";
    case HederaFunctionality.FileAppend:
      return "FileAppend";
    case HederaFunctionality.FileUpdate:
      return "FileUpdate";
    case HederaFunctionality.FileDelete:
      return "FileDelete";
    case HederaFunctionality.CryptoGetAccountBalance:
      return "CryptoGetAccountBalance";
    case HederaFunctionality.CryptoGetAccountRecords:
      return "CryptoGetAccountRecords";
    case HederaFunctionality.CryptoGetInfo:
      return "CryptoGetInfo";
    case HederaFunctionality.ContractCallLocal:
      return "ContractCallLocal";
    case HederaFunctionality.ContractGetInfo:
      return "ContractGetInfo";
    case HederaFunctionality.ContractGetBytecode:
      return "ContractGetBytecode";
    case HederaFunctionality.GetBySolidityID:
      return "GetBySolidityID";
    case HederaFunctionality.GetByKey:
      return "GetByKey";
    case HederaFunctionality.CryptoGetLiveHash:
      return "CryptoGetLiveHash";
    case HederaFunctionality.CryptoGetStakers:
      return "CryptoGetStakers";
    case HederaFunctionality.FileGetContents:
      return "FileGetContents";
    case HederaFunctionality.FileGetInfo:
      return "FileGetInfo";
    case HederaFunctionality.TransactionGetRecord:
      return "TransactionGetRecord";
    case HederaFunctionality.ContractGetRecords:
      return "ContractGetRecords";
    case HederaFunctionality.CryptoCreate:
      return "CryptoCreate";
    case HederaFunctionality.SystemDelete:
      return "SystemDelete";
    case HederaFunctionality.SystemUndelete:
      return "SystemUndelete";
    case HederaFunctionality.ContractDelete:
      return "ContractDelete";
    case HederaFunctionality.Freeze:
      return "Freeze";
    case HederaFunctionality.CreateTransactionRecord:
      return "CreateTransactionRecord";
    case HederaFunctionality.CryptoAccountAutoRenew:
      return "CryptoAccountAutoRenew";
    case HederaFunctionality.ContractAutoRenew:
      return "ContractAutoRenew";
    case HederaFunctionality.GetVersionInfo:
      return "GetVersionInfo";
    case HederaFunctionality.TransactionGetReceipt:
      return "TransactionGetReceipt";
    case HederaFunctionality.ConsensusCreateTopic:
      return "ConsensusCreateTopic";
    case HederaFunctionality.ConsensusUpdateTopic:
      return "ConsensusUpdateTopic";
    case HederaFunctionality.ConsensusDeleteTopic:
      return "ConsensusDeleteTopic";
    case HederaFunctionality.ConsensusGetTopicInfo:
      return "ConsensusGetTopicInfo";
    case HederaFunctionality.ConsensusSubmitMessage:
      return "ConsensusSubmitMessage";
    case HederaFunctionality.UncheckedSubmit:
      return "UncheckedSubmit";
    case HederaFunctionality.TokenCreate:
      return "TokenCreate";
    case HederaFunctionality.TokenGetInfo:
      return "TokenGetInfo";
    case HederaFunctionality.TokenFreezeAccount:
      return "TokenFreezeAccount";
    case HederaFunctionality.TokenUnfreezeAccount:
      return "TokenUnfreezeAccount";
    case HederaFunctionality.TokenGrantKycToAccount:
      return "TokenGrantKycToAccount";
    case HederaFunctionality.TokenRevokeKycFromAccount:
      return "TokenRevokeKycFromAccount";
    case HederaFunctionality.TokenDelete:
      return "TokenDelete";
    case HederaFunctionality.TokenUpdate:
      return "TokenUpdate";
    case HederaFunctionality.TokenMint:
      return "TokenMint";
    case HederaFunctionality.TokenBurn:
      return "TokenBurn";
    case HederaFunctionality.TokenAccountWipe:
      return "TokenAccountWipe";
    case HederaFunctionality.TokenAssociateToAccount:
      return "TokenAssociateToAccount";
    case HederaFunctionality.TokenDissociateFromAccount:
      return "TokenDissociateFromAccount";
    case HederaFunctionality.ScheduleCreate:
      return "ScheduleCreate";
    case HederaFunctionality.ScheduleDelete:
      return "ScheduleDelete";
    case HederaFunctionality.ScheduleSign:
      return "ScheduleSign";
    case HederaFunctionality.ScheduleGetInfo:
      return "ScheduleGetInfo";
    case HederaFunctionality.TokenGetAccountNftInfos:
      return "TokenGetAccountNftInfos";
    case HederaFunctionality.TokenGetNftInfo:
      return "TokenGetNftInfo";
    case HederaFunctionality.TokenGetNftInfos:
      return "TokenGetNftInfos";
    case HederaFunctionality.TokenFeeScheduleUpdate:
      return "TokenFeeScheduleUpdate";
    case HederaFunctionality.NetworkGetExecutionTime:
      return "NetworkGetExecutionTime";
    case HederaFunctionality.TokenPause:
      return "TokenPause";
    case HederaFunctionality.TokenUnpause:
      return "TokenUnpause";
    case HederaFunctionality.CryptoApproveAllowance:
      return "CryptoApproveAllowance";
    case HederaFunctionality.CryptoAdjustAllowance:
      return "CryptoAdjustAllowance";
    default:
      return "UNKNOWN";
  }
}

/**
 * Each shard has a nonnegative shard number. Each realm within a given shard has a nonnegative
 * realm number (that number might be reused in other shards). And each account, file, and smart
 * contract instance within a given realm has a nonnegative number (which might be reused in other
 * realms).  Every account, file, and smart contract instance is within exactly one realm. So a
 * FileID is a triplet of numbers, like 0.1.2 for entity number 2 within realm 1  within shard 0.
 * Each realm maintains a single counter for assigning numbers,  so if there is a file with ID
 * 0.1.2, then there won't be an account or smart  contract instance with ID 0.1.2.
 *
 * Everything is partitioned into realms so that each Solidity smart contract can  access everything
 * in just a single realm, locking all those entities while it's  running, but other smart contracts
 * could potentially run in other realms in  parallel. So realms allow Solidity to be parallelized
 * somewhat, even though the  language itself assumes everything is serial.
 */
export interface ShardID {
  /** the shard number (nonnegative) */
  shardNum: number;
}

/**
 * The ID for a realm. Within a given shard, every realm has a unique ID. Each account, file, and
 * contract instance belongs to exactly one realm.
 */
export interface RealmID {
  /** The shard number (nonnegative) */
  shardNum: number;
  /** The realm number (nonnegative) */
  realmNum: number;
}

/** The ID for an a cryptocurrency account */
export interface AccountID {
  /** The shard number (nonnegative) */
  shardNum: number;
  /** The realm number (nonnegative) */
  realmNum: number;
  account?:
    | { $case: "accountNum"; accountNum: number }
    | { $case: "alias"; alias: Uint8Array };
}

/** The ID for a file */
export interface FileID {
  /** The shard number (nonnegative) */
  shardNum: number;
  /** The realm number (nonnegative) */
  realmNum: number;
  /** A nonnegative File number unique within its realm */
  fileNum: number;
}

/** The ID for a smart contract instance */
export interface ContractID {
  /** The shard number (nonnegative) */
  shardNum: number;
  /** The realm number (nonnegative) */
  realmNum: number;
  contract?:
    | { $case: "contractNum"; contractNum: number }
    | { $case: "evmAddress"; evmAddress: Uint8Array };
}

/**
 * The ID for a transaction. This is used for retrieving receipts and records for a transaction, for
 * appending to a file right after creating it, for instantiating a smart contract with bytecode in
 * a file just created, and internally by the network for detecting when duplicate transactions are
 * submitted. A user might get a transaction processed faster by submitting it to N nodes, each with
 * a different node account, but all with the same TransactionID. Then, the transaction will take
 * effect when the first of all those nodes submits the transaction and it reaches consensus. The
 * other transactions will not take effect. So this could make the transaction take effect faster,
 * if any given node might be slow. However, the full transaction fee is charged for each
 * transaction, so the total fee is N times as much if the transaction is sent to N nodes.
 *
 * Applicable to Scheduled Transactions:
 *  - The ID of a Scheduled Transaction has transactionValidStart and accountIDs inherited from the
 *    ScheduleCreate transaction that created it. That is to say that they are equal
 *  - The scheduled property is true for Scheduled Transactions
 *  - transactionValidStart, accountID and scheduled properties should be omitted
 */
export interface TransactionID {
  /** The transaction is invalid if consensusTimestamp < transactionID.transactionStartValid */
  transactionValidStart: Timestamp | undefined;
  /** The Account ID that paid for this transaction */
  accountID: AccountID | undefined;
  /** Whether the Transaction is of type Scheduled or no */
  scheduled: boolean;
  /**
   * The identifier for an internal transaction that was spawned as part
   * of handling a user transaction. (These internal transactions share the
   * transactionValidStart and accountID of the user transaction, so a
   * nonce is necessary to give them a unique TransactionID.)
   *
   * An example is when a "parent" ContractCreate or ContractCall transaction
   * calls one or more HTS precompiled contracts; each of the "child"
   * transactions spawned for a precompile has a id with a different nonce.
   */
  nonce: number;
}

/** An account, and the amount that it sends or receives during a cryptocurrency or token transfer. */
export interface AccountAmount {
  /** The Account ID that sends/receives cryptocurrency or tokens */
  accountID: AccountID | undefined;
  /**
   * The amount of tinybars (for Crypto transfers) or in the lowest
   * denomination (for Token transfers) that the account sends(negative) or
   * receives(positive)
   */
  amount: number;
  /**
   * If true then the transfer is expected to be an approved allowance and the
   * accountID is expected to be the owner. The default is false (omitted).
   */
  isApproval: boolean;
}

/** A list of accounts and amounts to transfer out of each account (negative) or into it (positive). */
export interface TransferList {
  /**
   * Multiple list of AccountAmount pairs, each of which has an account and
   * an amount to transfer into it (positive) or out of it (negative)
   */
  accountAmounts: AccountAmount[];
}

/**
 * A sender account, a receiver account, and the serial number of an NFT of a Token with
 * NON_FUNGIBLE_UNIQUE type. When minting NFTs the sender will be the default AccountID instance
 * (0.0.0) and when burning NFTs, the receiver will be the default AccountID instance.
 */
export interface NftTransfer {
  /** The accountID of the sender */
  senderAccountID: AccountID | undefined;
  /** The accountID of the receiver */
  receiverAccountID: AccountID | undefined;
  /** The serial number of the NFT */
  serialNumber: number;
  /**
   * If true then the transfer is expected to be an approved allowance and the
   * senderAccountID is expected to be the owner. The default is false (omitted).
   */
  isApproval: boolean;
}

/**
 * A list of token IDs and amounts representing the transferred out (negative) or into (positive)
 * amounts, represented in the lowest denomination of the token
 */
export interface TokenTransferList {
  /** The ID of the token */
  token: TokenID | undefined;
  /**
   * Applicable to tokens of type FUNGIBLE_COMMON. Multiple list of AccountAmounts, each of which
   * has an account and amount
   */
  transfers: AccountAmount[];
  /**
   * Applicable to tokens of type NON_FUNGIBLE_UNIQUE. Multiple list of NftTransfers, each of
   * which has a sender and receiver account, including the serial number of the NFT
   */
  nftTransfers: NftTransfer[];
  /**
   * If present, the number of decimals this fungible token type is expected to have. The transfer
   * will fail with UNEXPECTED_TOKEN_DECIMALS if the actual decimals differ.
   */
  expectedDecimals: number | undefined;
}

/** A rational number, used to set the amount of a value transfer to collect as a custom fee */
export interface Fraction {
  /** The rational's numerator */
  numerator: number;
  /** The rational's denominator; a zero value will result in FRACTION_DIVIDES_BY_ZERO */
  denominator: number;
}

/** Unique identifier for a topic (used by the consensus service) */
export interface TopicID {
  /** The shard number (nonnegative) */
  shardNum: number;
  /** The realm number (nonnegative) */
  realmNum: number;
  /** Unique topic identifier within a realm (nonnegative). */
  topicNum: number;
}

/** Unique identifier for a token */
export interface TokenID {
  /** A nonnegative shard number */
  shardNum: number;
  /** A nonnegative realm number */
  realmNum: number;
  /** A nonnegative token number */
  tokenNum: number;
}

/** Unique identifier for a Schedule */
export interface ScheduleID {
  /** A nonnegative shard number */
  shardNum: number;
  /** A nonnegative realm number */
  realmNum: number;
  /** A nonnegative schedule number */
  scheduleNum: number;
}

/**
 * A Key can be a public key from either the Ed25519 or ECDSA(secp256k1) signature schemes, where
 * in the ECDSA(secp256k1) case we require the 33-byte compressed form of the public key. We call
 * these public keys <b>primitive keys</b>.
 *
 * If an account has primitive key associated to it, then the corresponding private key must sign
 * any transaction to transfer cryptocurrency out of it.
 *
 * A Key can also be the ID of a smart contract instance, which is then authorized to perform any
 * precompiled contract action that requires this key to sign.
 *
 * Note that when a Key is a smart contract ID, it <i>doesn't</i> mean the contract with that ID
 * will actually create a cryptographic signature. It only means that when the contract calls a
 * precompiled contract, the resulting "child transaction" will be authorized to perform any action
 * controlled by the Key.
 *
 * A Key can be a "threshold key", which means a list of M keys, any N of which must sign in order
 * for the threshold signature to be considered valid. The keys within a threshold signature may
 * themselves be threshold signatures, to allow complex signature requirements.
 *
 * A Key can be a "key list" where all keys in the list must sign unless specified otherwise in the
 * documentation for a specific transaction type (e.g.  FileDeleteTransactionBody).  Their use is
 * dependent on context. For example, a Hedera file is created with a list of keys, where all of
 * them must sign a transaction to create or modify the file, but only one of them is needed to sign
 * a transaction to delete the file. So it's a single list that sometimes acts as a 1-of-M threshold
 * key, and sometimes acts as an M-of-M threshold key.  A key list is always an M-of-M, unless
 * specified otherwise in documentation. A key list can have nested key lists or threshold keys.
 * Nested key lists are always M-of-M. A key list can have repeated primitive public keys, but all
 * repeated keys are only required to sign once.
 *
 * A Key can contain a ThresholdKey or KeyList, which in turn contain a Key, so this mutual
 * recursion would allow nesting arbitrarily deep. A ThresholdKey which contains a list of primitive
 * keys has 3 levels: ThresholdKey -> KeyList -> Key. A KeyList which contains several primitive
 * keys has 2 levels: KeyList -> Key. A Key with 2 levels of nested ThresholdKeys has 7 levels:
 * Key -> ThresholdKey -> KeyList -> Key -> ThresholdKey -> KeyList -> Key.
 *
 * Each Key should not have more than 46 levels, which implies 15 levels of nested ThresholdKeys.
 */
export interface Key {
  key?:
    | { $case: "contractID"; contractID: ContractID }
    | { $case: "ed25519"; ed25519: Uint8Array }
    | { $case: "rsa3072"; rsa3072: Uint8Array }
    | { $case: "ecdsa384"; ecdsa384: Uint8Array }
    | { $case: "thresholdKey"; thresholdKey: ThresholdKey }
    | { $case: "keyList"; keyList: KeyList }
    | { $case: "ECDSASecp256k1"; ECDSASecp256k1: Uint8Array }
    | { $case: "delegatableContractId"; delegatableContractId: ContractID };
}

/**
 * A set of public keys that are used together to form a threshold signature.  If the threshold is N
 * and there are M keys, then this is an N of M threshold signature. If an account is associated
 * with ThresholdKeys, then a transaction to move cryptocurrency out of it must be signed by a list
 * of M signatures, where at most M-N of them are blank, and the other at least N of them are valid
 * signatures corresponding to at least N of the public keys listed here.
 */
export interface ThresholdKey {
  /** A valid signature set must have at least this many signatures */
  threshold: number;
  /** List of all the keys that can sign */
  keys: KeyList | undefined;
}

/**
 * A list of keys that requires all keys (M-of-M) to sign unless otherwise specified in
 * documentation. A KeyList may contain repeated keys, but all repeated keys are only required to
 * sign once.
 */
export interface KeyList {
  /** list of keys */
  keys: Key[];
}

/**
 * This message is <b>DEPRECATED</b> and <b>UNUSABLE</b> with network nodes. It is retained
 * here only for historical reasons.
 *
 * Please use the SignaturePair and SignatureMap messages.
 *
 * @deprecated
 */
export interface Signature {
  signature?:
    | { $case: "contract"; contract: Uint8Array }
    | { $case: "ed25519"; ed25519: Uint8Array }
    | { $case: "rsa3072"; rsa3072: Uint8Array }
    | { $case: "ecdsa384"; ecdsa384: Uint8Array }
    | { $case: "thresholdSignature"; thresholdSignature: ThresholdSignature }
    | { $case: "signatureList"; signatureList: SignatureList };
}

/**
 * This message is <b>DEPRECATED</b> and <b>UNUSABLE</b> with network nodes. It is retained
 * here only for historical reasons.
 *
 * Please use the SignaturePair and SignatureMap messages.
 *
 * @deprecated
 */
export interface ThresholdSignature {
  /**
   * for an N-of-M threshold key, this is a list of M signatures, at least N of which must be
   * non-null
   */
  sigs: SignatureList | undefined;
}

/**
 * This message is <b>DEPRECATED</b> and <b>UNUSABLE</b> with network nodes. It is retained
 * here only for historical reasons.
 *
 * Please use the SignaturePair and SignatureMap messages.
 *
 * @deprecated
 */
export interface SignatureList {
  /** each signature corresponds to a Key in the KeyList */
  sigs: Signature[];
}

/**
 * The client may use any number of bytes from zero to the whole length of the public key for
 * pubKeyPrefix. If zero bytes are used, then it must be that only one primitive key is required
 * to sign the linked transaction; it will surely resolve to <tt>INVALID_SIGNATURE</tt> otherwise.
 *
 * <b>IMPORTANT:</b> In the special case that a signature is being provided for a key used to
 * authorize a precompiled contract, the <tt>pubKeyPrefix</tt> must contain the <b>entire public
 * key</b>! That is, if the key is a Ed25519 key, the <tt>pubKeyPrefix</tt> should be 32 bytes
 * long. If the key is a ECDSA(secp256k1) key, the <tt>pubKeyPrefix</tt> should be 33 bytes long,
 * since we require the compressed form of the public key.
 *
 * Only Ed25519 and ECDSA(secp256k1) keys and hence signatures are currently supported.
 */
export interface SignaturePair {
  /** First few bytes of the public key */
  pubKeyPrefix: Uint8Array;
  signature?:
    | { $case: "contract"; contract: Uint8Array }
    | { $case: "ed25519"; ed25519: Uint8Array }
    | { $case: "rsa3072"; rsa3072: Uint8Array }
    | { $case: "ecdsa384"; ecdsa384: Uint8Array }
    | { $case: "ECDSASecp256k1"; ECDSASecp256k1: Uint8Array };
}

/**
 * A set of signatures corresponding to every unique public key used to sign a given transaction. If
 * one public key matches more than one prefixes on the signature map, the transaction containing
 * the map will fail immediately with the response code KEY_PREFIX_MISMATCH.
 */
export interface SignatureMap {
  /** Each signature pair corresponds to a unique Key required to sign the transaction. */
  sigPair: SignaturePair[];
}

/**
 * A set of prices the nodes use in determining transaction and query fees, and constants involved
 * in fee calculations.  Nodes multiply the amount of resources consumed by a transaction or query
 * by the corresponding price to calculate the appropriate fee. Units are one-thousandth of a
 * tinyCent.
 */
export interface FeeComponents {
  /** A minimum, the calculated fee must be greater than this value */
  min: number;
  /** A maximum, the calculated fee must be less than this value */
  max: number;
  /** A constant contribution to the fee */
  constant: number;
  /** The price of bandwidth consumed by a transaction, measured in bytes */
  bpt: number;
  /** The price per signature verification for a transaction */
  vpt: number;
  /** The price of RAM consumed by a transaction, measured in byte-hours */
  rbh: number;
  /** The price of storage consumed by a transaction, measured in byte-hours */
  sbh: number;
  /** The price of computation for a smart contract transaction, measured in gas */
  gas: number;
  /** The price per hbar transferred for a transfer */
  tv: number;
  /** The price of bandwidth for data retrieved from memory for a response, measured in bytes */
  bpr: number;
  /** The price of bandwidth for data retrieved from disk for a response, measured in bytes */
  sbpr: number;
}

/** The fees for a specific transaction or query based on the fee data. */
export interface TransactionFeeSchedule {
  /** A particular transaction or query */
  hederaFunctionality: HederaFunctionality;
  /**
   * Resource price coefficients
   *
   * @deprecated
   */
  feeData: FeeData | undefined;
  /** Resource price coefficients. Supports subtype price definition. */
  fees: FeeData[];
}

/**
 * The total fee charged for a transaction. It is composed of three components – a node fee that
 * compensates the specific node that submitted the transaction, a network fee that compensates the
 * network for assigning the transaction a consensus timestamp, and a service fee that compensates
 * the network for the ongoing maintenance of the consequences of the transaction.
 */
export interface FeeData {
  /** Fee paid to the submitting node */
  nodedata: FeeComponents | undefined;
  /** Fee paid to the network for processing a transaction into consensus */
  networkdata: FeeComponents | undefined;
  /**
   * Fee paid to the network for providing the service associated with the
   * transaction; for instance, storing a file
   */
  servicedata: FeeComponents | undefined;
  /**
   * SubType distinguishing between different types of FeeData, correlating
   * to the same HederaFunctionality
   */
  subType: SubType;
}

/**
 * A list of resource prices fee for different transactions and queries and the time period at which
 * this fee schedule will expire. Nodes use the prices to determine the fees for all transactions
 * based on how much of those resources each transaction uses.
 */
export interface FeeSchedule {
  /** List of price coefficients for network resources */
  transactionFeeSchedule: TransactionFeeSchedule[];
  /** FeeSchedule expiry time */
  expiryTime: TimestampSeconds | undefined;
}

/** This contains two Fee Schedules with expiry timestamp. */
export interface CurrentAndNextFeeSchedule {
  /** Contains current Fee Schedule */
  currentFeeSchedule: FeeSchedule | undefined;
  /** Contains next Fee Schedule */
  nextFeeSchedule: FeeSchedule | undefined;
}

/**
 * Contains the IP address and the port representing a service endpoint of a Node in a network. Used
 * to reach the Hedera API and submit transactions to the network.
 */
export interface ServiceEndpoint {
  /**
   * The 32-bit IPv4 address of the node encoded in left to right order (e.g.  127.0.0.1 has 127
   * as its first byte)
   */
  ipAddressV4: Uint8Array;
  /** The port of the node */
  port: number;
}

/**
 * The data about a node, including its service endpoints and the Hedera account to be paid for
 * services provided by the node (that is, queries answered and transactions submitted.)
 *
 * If the <tt>serviceEndpoint</tt> list is not set, or empty, then the endpoint given by the
 * (deprecated) <tt>ipAddress</tt> and <tt>portno</tt> fields should be used.
 *
 * All fields are populated in the 0.0.102 address book file while only fields that start with # are
 * populated in the 0.0.101 address book file.
 */
export interface NodeAddress {
  /**
   * The IP address of the Node with separator & octets encoded in UTF-8.  Usage is deprecated,
   * ServiceEndpoint is preferred to retrieve a node's list of IP addresses and ports
   *
   * @deprecated
   */
  ipAddress: Uint8Array;
  /**
   * The port number of the grpc server for the node.  Usage is deprecated, ServiceEndpoint is
   * preferred to retrieve a node's list of IP addresses and ports
   *
   * @deprecated
   */
  portno: number;
  /**
   * Usage is deprecated, nodeAccountId is preferred to retrieve a node's account ID
   *
   * @deprecated
   */
  memo: Uint8Array;
  /**
   * The node's X509 RSA public key used to sign stream files (e.g., record stream
   * files). Precisely, this field is a string of hexadecimal characters which,
   * translated to binary, are the public key's DER encoding.
   */
  RSAPubKey: string;
  /** # A non-sequential identifier for the node */
  nodeId: number;
  /** # The account to be paid for queries and transactions sent to this node */
  nodeAccountId: AccountID | undefined;
  /**
   * # Hash of the node's TLS certificate. Precisely, this field is a string of
   * hexadecimal characters which, translated to binary, are the SHA-384 hash of
   * the UTF-8 NFKD encoding of the node's TLS cert in PEM format. Its value can be
   * used to verify the node's certificate it presents during TLS negotiations.
   */
  nodeCertHash: Uint8Array;
  /** # A node's service IP addresses and ports */
  serviceEndpoint: ServiceEndpoint[];
  /** A description of the node, with UTF-8 encoding up to 100 bytes */
  description: string;
  /** The amount of tinybars staked to the node */
  stake: number;
}

/**
 * A list of nodes and their metadata that contains all details of the nodes for the network.  Used
 * to parse the contents of system files <tt>0.0.101</tt> and <tt>0.0.102</tt>.
 */
export interface NodeAddressBook {
  /** Metadata of all nodes in the network */
  nodeAddress: NodeAddress[];
}

/**
 * Hedera follows semantic versioning (https://semver.org/) for both the HAPI protobufs and the
 * Services software.  This type allows the <tt>getVersionInfo</tt> query in the
 * <tt>NetworkService</tt> to return the deployed versions of both protobufs and software on the
 * node answering the query.
 */
export interface SemanticVersion {
  /** Increases with incompatible API changes */
  major: number;
  /** Increases with backwards-compatible new functionality */
  minor: number;
  /** Increases with backwards-compatible bug fixes */
  patch: number;
  /**
   * A pre-release version MAY be denoted by appending a hyphen and a series of dot separated
   * identifiers (https://semver.org/#spec-item-9); so given a semver 0.14.0-alpha.1+21AF26D3,
   * this field would contain 'alpha.1'
   */
  pre: string;
  /**
   * Build metadata MAY be denoted by appending a plus sign and a series of dot separated
   * identifiers immediately following the patch or pre-release version
   * (https://semver.org/#spec-item-10); so given a semver 0.14.0-alpha.1+21AF26D3, this field
   * would contain '21AF26D3'
   */
  build: string;
}

/** UNDOCUMENTED */
export interface Setting {
  /** name of the property */
  name: string;
  /** value of the property */
  value: string;
  /** any data associated with property */
  data: Uint8Array;
}

/** UNDOCUMENTED */
export interface ServicesConfigurationList {
  /** list of name value pairs of the application properties */
  nameValue: Setting[];
}

/** Token's information related to the given Account */
export interface TokenRelationship {
  /** The ID of the token */
  tokenId: TokenID | undefined;
  /** The Symbol of the token */
  symbol: string;
  /**
   * For token of type FUNGIBLE_COMMON - the balance that the Account holds in the smallest
   * denomination. For token of type NON_FUNGIBLE_UNIQUE - the number of NFTs held by the account
   */
  balance: number;
  /**
   * The KYC status of the account (KycNotApplicable, Granted or Revoked). If the token does not
   * have KYC key, KycNotApplicable is returned
   */
  kycStatus: TokenKycStatus;
  /**
   * The Freeze status of the account (FreezeNotApplicable, Frozen or Unfrozen). If the token does
   * not have Freeze key, FreezeNotApplicable is returned
   */
  freezeStatus: TokenFreezeStatus;
  /** Tokens divide into <tt>10<sup>decimals</sup></tt> pieces */
  decimals: number;
  /**
   * Specifies if the relationship is created implicitly. False : explicitly associated, True :
   * implicitly associated.
   */
  automaticAssociation: boolean;
}

/**
 * A number of <i>transferable units</i> of a certain token.
 *
 * The transferable unit of a token is its smallest denomination, as given by the token's
 * <tt>decimals</tt> property---each minted token contains <tt>10<sup>decimals</sup></tt>
 * transferable units. For example, we could think of the cent as the transferable unit of the US
 * dollar (<tt>decimals=2</tt>); and the tinybar as the transferable unit of hbar
 * (<tt>decimals=8</tt>).
 *
 * Transferable units are not directly comparable across different tokens.
 */
export interface TokenBalance {
  /** A unique token id */
  tokenId: TokenID | undefined;
  /**
   * Number of transferable units of the identified token. For token of type FUNGIBLE_COMMON -
   * balance in the smallest denomination. For token of type NON_FUNGIBLE_UNIQUE - the number of
   * NFTs held by the account
   */
  balance: number;
  /** Tokens divide into <tt>10<sup>decimals</sup></tt> pieces */
  decimals: number;
}

/** A sequence of token balances */
export interface TokenBalances {
  tokenBalances: TokenBalance[];
}

/** A token - account association */
export interface TokenAssociation {
  /** The token involved in the association */
  tokenId: TokenID | undefined;
  /** The account involved in the association */
  accountId: AccountID | undefined;
}

/** An approved allowance of hbar transfers for a spender. */
export interface CryptoAllowance {
  /** The account ID of the hbar owner (ie. the grantor of the allowance). */
  owner: AccountID | undefined;
  /** The account ID of the spender of the hbar allowance. */
  spender: AccountID | undefined;
  /** The amount of the spender's allowance in tinybars. */
  amount: number;
}

/** An approved allowance of non-fungible token transfers for a spender. */
export interface NftAllowance {
  /** The token that the allowance pertains to. */
  tokenId: TokenID | undefined;
  /** The account ID of the token owner (ie. the grantor of the allowance). */
  owner: AccountID | undefined;
  /** The account ID of the token allowance spender. */
  spender: AccountID | undefined;
  /** The list of serial numbers that the spender is permitted to transfer. */
  serialNumbers: number[];
  /**
   * If true, the spender has access to all of the account owner's NFT instances (currently
   * owned and any in the future). If this field is set to true the serialNumbers field
   * should be empty.
   */
  approvedForAll: boolean | undefined;
}

/** An approved allowance of fungible token transfers for a spender. */
export interface TokenAllowance {
  /** The token that the allowance pertains to. */
  tokenId: TokenID | undefined;
  /** The account ID of the token owner (ie. the grantor of the allowance). */
  owner: AccountID | undefined;
  /** The account ID of the token allowance spender. */
  spender: AccountID | undefined;
  /** The amount of the spender's token allowance. */
  amount: number;
}

/** A granted allowance of hbar transfers for a spender relative to the owner account. */
export interface GrantedCryptoAllowance {
  /** The account ID of the spender of the hbar allowance. */
  spender: AccountID | undefined;
  /** The amount of the spender's allowance in tinybars. */
  amount: number;
}

/** A granted allowance of non-fungible token transfers for a spender relative to the owner account. */
export interface GrantedNftAllowance {
  /** The token that the allowance pertains to. */
  tokenId: TokenID | undefined;
  /** The account ID of the token allowance spender. */
  spender: AccountID | undefined;
  /** The list of serial numbers that the spender is permitted to transfer. */
  serialNumbers: number[];
  /**
   * If true, the spender has access to all of the account owner's NFT instances (currently
   * owned and any in the future). If this field is set to true the serialNumbers field
   * should be empty.
   */
  approvedForAll: boolean;
}

/** A granted allowance of fungible token transfers for a spender relative to the owner account. */
export interface GrantedTokenAllowance {
  /** The token that the allowance pertains to. */
  tokenId: TokenID | undefined;
  /** The account ID of the token allowance spender. */
  spender: AccountID | undefined;
  /** The amount of the spender's token allowance. */
  amount: number;
}

function createBaseShardID(): ShardID {
  return { shardNum: 0 };
}

export const ShardID = {
  encode(
    message: ShardID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ShardID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShardID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ShardID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
    };
  },

  toJSON(message: ShardID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    return obj;
  },

  fromPartial(object: DeepPartial<ShardID>): ShardID {
    const message = createBaseShardID();
    message.shardNum = object.shardNum ?? 0;
    return message;
  },
};

function createBaseRealmID(): RealmID {
  return { shardNum: 0, realmNum: 0 };
}

export const RealmID = {
  encode(
    message: RealmID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    if (message.realmNum !== 0) {
      writer.uint32(16).int64(message.realmNum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RealmID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRealmID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.realmNum = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RealmID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
      realmNum: isSet(object.realmNum) ? Number(object.realmNum) : 0,
    };
  },

  toJSON(message: RealmID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    message.realmNum !== undefined &&
      (obj.realmNum = Math.round(message.realmNum));
    return obj;
  },

  fromPartial(object: DeepPartial<RealmID>): RealmID {
    const message = createBaseRealmID();
    message.shardNum = object.shardNum ?? 0;
    message.realmNum = object.realmNum ?? 0;
    return message;
  },
};

function createBaseAccountID(): AccountID {
  return { shardNum: 0, realmNum: 0, account: undefined };
}

export const AccountID = {
  encode(
    message: AccountID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    if (message.realmNum !== 0) {
      writer.uint32(16).int64(message.realmNum);
    }
    if (message.account?.$case === "accountNum") {
      writer.uint32(24).int64(message.account.accountNum);
    }
    if (message.account?.$case === "alias") {
      writer.uint32(34).bytes(message.account.alias);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.realmNum = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.account = {
            $case: "accountNum",
            accountNum: longToNumber(reader.int64() as Long),
          };
          break;
        case 4:
          message.account = { $case: "alias", alias: reader.bytes() };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AccountID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
      realmNum: isSet(object.realmNum) ? Number(object.realmNum) : 0,
      account: isSet(object.accountNum)
        ? { $case: "accountNum", accountNum: Number(object.accountNum) }
        : isSet(object.alias)
        ? { $case: "alias", alias: bytesFromBase64(object.alias) }
        : undefined,
    };
  },

  toJSON(message: AccountID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    message.realmNum !== undefined &&
      (obj.realmNum = Math.round(message.realmNum));
    message.account?.$case === "accountNum" &&
      (obj.accountNum = Math.round(message.account?.accountNum));
    message.account?.$case === "alias" &&
      (obj.alias =
        message.account?.alias !== undefined
          ? base64FromBytes(message.account?.alias)
          : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<AccountID>): AccountID {
    const message = createBaseAccountID();
    message.shardNum = object.shardNum ?? 0;
    message.realmNum = object.realmNum ?? 0;
    if (
      object.account?.$case === "accountNum" &&
      object.account?.accountNum !== undefined &&
      object.account?.accountNum !== null
    ) {
      message.account = {
        $case: "accountNum",
        accountNum: object.account.accountNum,
      };
    }
    if (
      object.account?.$case === "alias" &&
      object.account?.alias !== undefined &&
      object.account?.alias !== null
    ) {
      message.account = { $case: "alias", alias: object.account.alias };
    }
    return message;
  },
};

function createBaseFileID(): FileID {
  return { shardNum: 0, realmNum: 0, fileNum: 0 };
}

export const FileID = {
  encode(
    message: FileID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    if (message.realmNum !== 0) {
      writer.uint32(16).int64(message.realmNum);
    }
    if (message.fileNum !== 0) {
      writer.uint32(24).int64(message.fileNum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.realmNum = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.fileNum = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FileID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
      realmNum: isSet(object.realmNum) ? Number(object.realmNum) : 0,
      fileNum: isSet(object.fileNum) ? Number(object.fileNum) : 0,
    };
  },

  toJSON(message: FileID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    message.realmNum !== undefined &&
      (obj.realmNum = Math.round(message.realmNum));
    message.fileNum !== undefined &&
      (obj.fileNum = Math.round(message.fileNum));
    return obj;
  },

  fromPartial(object: DeepPartial<FileID>): FileID {
    const message = createBaseFileID();
    message.shardNum = object.shardNum ?? 0;
    message.realmNum = object.realmNum ?? 0;
    message.fileNum = object.fileNum ?? 0;
    return message;
  },
};

function createBaseContractID(): ContractID {
  return { shardNum: 0, realmNum: 0, contract: undefined };
}

export const ContractID = {
  encode(
    message: ContractID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    if (message.realmNum !== 0) {
      writer.uint32(16).int64(message.realmNum);
    }
    if (message.contract?.$case === "contractNum") {
      writer.uint32(24).int64(message.contract.contractNum);
    }
    if (message.contract?.$case === "evmAddress") {
      writer.uint32(34).bytes(message.contract.evmAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.realmNum = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.contract = {
            $case: "contractNum",
            contractNum: longToNumber(reader.int64() as Long),
          };
          break;
        case 4:
          message.contract = {
            $case: "evmAddress",
            evmAddress: reader.bytes(),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
      realmNum: isSet(object.realmNum) ? Number(object.realmNum) : 0,
      contract: isSet(object.contractNum)
        ? { $case: "contractNum", contractNum: Number(object.contractNum) }
        : isSet(object.evmAddress)
        ? {
            $case: "evmAddress",
            evmAddress: bytesFromBase64(object.evmAddress),
          }
        : undefined,
    };
  },

  toJSON(message: ContractID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    message.realmNum !== undefined &&
      (obj.realmNum = Math.round(message.realmNum));
    message.contract?.$case === "contractNum" &&
      (obj.contractNum = Math.round(message.contract?.contractNum));
    message.contract?.$case === "evmAddress" &&
      (obj.evmAddress =
        message.contract?.evmAddress !== undefined
          ? base64FromBytes(message.contract?.evmAddress)
          : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ContractID>): ContractID {
    const message = createBaseContractID();
    message.shardNum = object.shardNum ?? 0;
    message.realmNum = object.realmNum ?? 0;
    if (
      object.contract?.$case === "contractNum" &&
      object.contract?.contractNum !== undefined &&
      object.contract?.contractNum !== null
    ) {
      message.contract = {
        $case: "contractNum",
        contractNum: object.contract.contractNum,
      };
    }
    if (
      object.contract?.$case === "evmAddress" &&
      object.contract?.evmAddress !== undefined &&
      object.contract?.evmAddress !== null
    ) {
      message.contract = {
        $case: "evmAddress",
        evmAddress: object.contract.evmAddress,
      };
    }
    return message;
  },
};

function createBaseTransactionID(): TransactionID {
  return {
    transactionValidStart: undefined,
    accountID: undefined,
    scheduled: false,
    nonce: 0,
  };
}

export const TransactionID = {
  encode(
    message: TransactionID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.transactionValidStart !== undefined) {
      Timestamp.encode(
        message.transactionValidStart,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.accountID !== undefined) {
      AccountID.encode(message.accountID, writer.uint32(18).fork()).ldelim();
    }
    if (message.scheduled === true) {
      writer.uint32(24).bool(message.scheduled);
    }
    if (message.nonce !== 0) {
      writer.uint32(32).int32(message.nonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionValidStart = Timestamp.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.accountID = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          message.scheduled = reader.bool();
          break;
        case 4:
          message.nonce = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionID {
    return {
      transactionValidStart: isSet(object.transactionValidStart)
        ? Timestamp.fromJSON(object.transactionValidStart)
        : undefined,
      accountID: isSet(object.accountID)
        ? AccountID.fromJSON(object.accountID)
        : undefined,
      scheduled: isSet(object.scheduled) ? Boolean(object.scheduled) : false,
      nonce: isSet(object.nonce) ? Number(object.nonce) : 0,
    };
  },

  toJSON(message: TransactionID): unknown {
    const obj: any = {};
    message.transactionValidStart !== undefined &&
      (obj.transactionValidStart = message.transactionValidStart
        ? Timestamp.toJSON(message.transactionValidStart)
        : undefined);
    message.accountID !== undefined &&
      (obj.accountID = message.accountID
        ? AccountID.toJSON(message.accountID)
        : undefined);
    message.scheduled !== undefined && (obj.scheduled = message.scheduled);
    message.nonce !== undefined && (obj.nonce = Math.round(message.nonce));
    return obj;
  },

  fromPartial(object: DeepPartial<TransactionID>): TransactionID {
    const message = createBaseTransactionID();
    message.transactionValidStart =
      object.transactionValidStart !== undefined &&
      object.transactionValidStart !== null
        ? Timestamp.fromPartial(object.transactionValidStart)
        : undefined;
    message.accountID =
      object.accountID !== undefined && object.accountID !== null
        ? AccountID.fromPartial(object.accountID)
        : undefined;
    message.scheduled = object.scheduled ?? false;
    message.nonce = object.nonce ?? 0;
    return message;
  },
};

function createBaseAccountAmount(): AccountAmount {
  return { accountID: undefined, amount: 0, isApproval: false };
}

export const AccountAmount = {
  encode(
    message: AccountAmount,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.accountID !== undefined) {
      AccountID.encode(message.accountID, writer.uint32(10).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(16).sint64(message.amount);
    }
    if (message.isApproval === true) {
      writer.uint32(24).bool(message.isApproval);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AccountAmount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccountAmount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountID = AccountID.decode(reader, reader.uint32());
          break;
        case 2:
          message.amount = longToNumber(reader.sint64() as Long);
          break;
        case 3:
          message.isApproval = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AccountAmount {
    return {
      accountID: isSet(object.accountID)
        ? AccountID.fromJSON(object.accountID)
        : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      isApproval: isSet(object.isApproval) ? Boolean(object.isApproval) : false,
    };
  },

  toJSON(message: AccountAmount): unknown {
    const obj: any = {};
    message.accountID !== undefined &&
      (obj.accountID = message.accountID
        ? AccountID.toJSON(message.accountID)
        : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    message.isApproval !== undefined && (obj.isApproval = message.isApproval);
    return obj;
  },

  fromPartial(object: DeepPartial<AccountAmount>): AccountAmount {
    const message = createBaseAccountAmount();
    message.accountID =
      object.accountID !== undefined && object.accountID !== null
        ? AccountID.fromPartial(object.accountID)
        : undefined;
    message.amount = object.amount ?? 0;
    message.isApproval = object.isApproval ?? false;
    return message;
  },
};

function createBaseTransferList(): TransferList {
  return { accountAmounts: [] };
}

export const TransferList = {
  encode(
    message: TransferList,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.accountAmounts) {
      AccountAmount.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransferList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransferList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountAmounts.push(
            AccountAmount.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransferList {
    return {
      accountAmounts: Array.isArray(object?.accountAmounts)
        ? object.accountAmounts.map((e: any) => AccountAmount.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TransferList): unknown {
    const obj: any = {};
    if (message.accountAmounts) {
      obj.accountAmounts = message.accountAmounts.map((e) =>
        e ? AccountAmount.toJSON(e) : undefined
      );
    } else {
      obj.accountAmounts = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TransferList>): TransferList {
    const message = createBaseTransferList();
    message.accountAmounts =
      object.accountAmounts?.map((e) => AccountAmount.fromPartial(e)) || [];
    return message;
  },
};

function createBaseNftTransfer(): NftTransfer {
  return {
    senderAccountID: undefined,
    receiverAccountID: undefined,
    serialNumber: 0,
    isApproval: false,
  };
}

export const NftTransfer = {
  encode(
    message: NftTransfer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.senderAccountID !== undefined) {
      AccountID.encode(
        message.senderAccountID,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.receiverAccountID !== undefined) {
      AccountID.encode(
        message.receiverAccountID,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.serialNumber !== 0) {
      writer.uint32(24).int64(message.serialNumber);
    }
    if (message.isApproval === true) {
      writer.uint32(32).bool(message.isApproval);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NftTransfer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNftTransfer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAccountID = AccountID.decode(reader, reader.uint32());
          break;
        case 2:
          message.receiverAccountID = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          message.serialNumber = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.isApproval = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NftTransfer {
    return {
      senderAccountID: isSet(object.senderAccountID)
        ? AccountID.fromJSON(object.senderAccountID)
        : undefined,
      receiverAccountID: isSet(object.receiverAccountID)
        ? AccountID.fromJSON(object.receiverAccountID)
        : undefined,
      serialNumber: isSet(object.serialNumber)
        ? Number(object.serialNumber)
        : 0,
      isApproval: isSet(object.isApproval) ? Boolean(object.isApproval) : false,
    };
  },

  toJSON(message: NftTransfer): unknown {
    const obj: any = {};
    message.senderAccountID !== undefined &&
      (obj.senderAccountID = message.senderAccountID
        ? AccountID.toJSON(message.senderAccountID)
        : undefined);
    message.receiverAccountID !== undefined &&
      (obj.receiverAccountID = message.receiverAccountID
        ? AccountID.toJSON(message.receiverAccountID)
        : undefined);
    message.serialNumber !== undefined &&
      (obj.serialNumber = Math.round(message.serialNumber));
    message.isApproval !== undefined && (obj.isApproval = message.isApproval);
    return obj;
  },

  fromPartial(object: DeepPartial<NftTransfer>): NftTransfer {
    const message = createBaseNftTransfer();
    message.senderAccountID =
      object.senderAccountID !== undefined && object.senderAccountID !== null
        ? AccountID.fromPartial(object.senderAccountID)
        : undefined;
    message.receiverAccountID =
      object.receiverAccountID !== undefined &&
      object.receiverAccountID !== null
        ? AccountID.fromPartial(object.receiverAccountID)
        : undefined;
    message.serialNumber = object.serialNumber ?? 0;
    message.isApproval = object.isApproval ?? false;
    return message;
  },
};

function createBaseTokenTransferList(): TokenTransferList {
  return {
    token: undefined,
    transfers: [],
    nftTransfers: [],
    expectedDecimals: undefined,
  };
}

export const TokenTransferList = {
  encode(
    message: TokenTransferList,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.token !== undefined) {
      TokenID.encode(message.token, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.transfers) {
      AccountAmount.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.nftTransfers) {
      NftTransfer.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.expectedDecimals !== undefined) {
      UInt32Value.encode(
        { value: message.expectedDecimals! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenTransferList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenTransferList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.transfers.push(AccountAmount.decode(reader, reader.uint32()));
          break;
        case 3:
          message.nftTransfers.push(
            NftTransfer.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.expectedDecimals = UInt32Value.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenTransferList {
    return {
      token: isSet(object.token) ? TokenID.fromJSON(object.token) : undefined,
      transfers: Array.isArray(object?.transfers)
        ? object.transfers.map((e: any) => AccountAmount.fromJSON(e))
        : [],
      nftTransfers: Array.isArray(object?.nftTransfers)
        ? object.nftTransfers.map((e: any) => NftTransfer.fromJSON(e))
        : [],
      expectedDecimals: isSet(object.expectedDecimals)
        ? Number(object.expectedDecimals)
        : undefined,
    };
  },

  toJSON(message: TokenTransferList): unknown {
    const obj: any = {};
    message.token !== undefined &&
      (obj.token = message.token ? TokenID.toJSON(message.token) : undefined);
    if (message.transfers) {
      obj.transfers = message.transfers.map((e) =>
        e ? AccountAmount.toJSON(e) : undefined
      );
    } else {
      obj.transfers = [];
    }
    if (message.nftTransfers) {
      obj.nftTransfers = message.nftTransfers.map((e) =>
        e ? NftTransfer.toJSON(e) : undefined
      );
    } else {
      obj.nftTransfers = [];
    }
    message.expectedDecimals !== undefined &&
      (obj.expectedDecimals = message.expectedDecimals);
    return obj;
  },

  fromPartial(object: DeepPartial<TokenTransferList>): TokenTransferList {
    const message = createBaseTokenTransferList();
    message.token =
      object.token !== undefined && object.token !== null
        ? TokenID.fromPartial(object.token)
        : undefined;
    message.transfers =
      object.transfers?.map((e) => AccountAmount.fromPartial(e)) || [];
    message.nftTransfers =
      object.nftTransfers?.map((e) => NftTransfer.fromPartial(e)) || [];
    message.expectedDecimals = object.expectedDecimals ?? undefined;
    return message;
  },
};

function createBaseFraction(): Fraction {
  return { numerator: 0, denominator: 0 };
}

export const Fraction = {
  encode(
    message: Fraction,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.numerator !== 0) {
      writer.uint32(8).int64(message.numerator);
    }
    if (message.denominator !== 0) {
      writer.uint32(16).int64(message.denominator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Fraction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFraction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.numerator = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.denominator = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Fraction {
    return {
      numerator: isSet(object.numerator) ? Number(object.numerator) : 0,
      denominator: isSet(object.denominator) ? Number(object.denominator) : 0,
    };
  },

  toJSON(message: Fraction): unknown {
    const obj: any = {};
    message.numerator !== undefined &&
      (obj.numerator = Math.round(message.numerator));
    message.denominator !== undefined &&
      (obj.denominator = Math.round(message.denominator));
    return obj;
  },

  fromPartial(object: DeepPartial<Fraction>): Fraction {
    const message = createBaseFraction();
    message.numerator = object.numerator ?? 0;
    message.denominator = object.denominator ?? 0;
    return message;
  },
};

function createBaseTopicID(): TopicID {
  return { shardNum: 0, realmNum: 0, topicNum: 0 };
}

export const TopicID = {
  encode(
    message: TopicID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    if (message.realmNum !== 0) {
      writer.uint32(16).int64(message.realmNum);
    }
    if (message.topicNum !== 0) {
      writer.uint32(24).int64(message.topicNum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TopicID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopicID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.realmNum = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.topicNum = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TopicID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
      realmNum: isSet(object.realmNum) ? Number(object.realmNum) : 0,
      topicNum: isSet(object.topicNum) ? Number(object.topicNum) : 0,
    };
  },

  toJSON(message: TopicID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    message.realmNum !== undefined &&
      (obj.realmNum = Math.round(message.realmNum));
    message.topicNum !== undefined &&
      (obj.topicNum = Math.round(message.topicNum));
    return obj;
  },

  fromPartial(object: DeepPartial<TopicID>): TopicID {
    const message = createBaseTopicID();
    message.shardNum = object.shardNum ?? 0;
    message.realmNum = object.realmNum ?? 0;
    message.topicNum = object.topicNum ?? 0;
    return message;
  },
};

function createBaseTokenID(): TokenID {
  return { shardNum: 0, realmNum: 0, tokenNum: 0 };
}

export const TokenID = {
  encode(
    message: TokenID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    if (message.realmNum !== 0) {
      writer.uint32(16).int64(message.realmNum);
    }
    if (message.tokenNum !== 0) {
      writer.uint32(24).int64(message.tokenNum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.realmNum = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.tokenNum = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
      realmNum: isSet(object.realmNum) ? Number(object.realmNum) : 0,
      tokenNum: isSet(object.tokenNum) ? Number(object.tokenNum) : 0,
    };
  },

  toJSON(message: TokenID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    message.realmNum !== undefined &&
      (obj.realmNum = Math.round(message.realmNum));
    message.tokenNum !== undefined &&
      (obj.tokenNum = Math.round(message.tokenNum));
    return obj;
  },

  fromPartial(object: DeepPartial<TokenID>): TokenID {
    const message = createBaseTokenID();
    message.shardNum = object.shardNum ?? 0;
    message.realmNum = object.realmNum ?? 0;
    message.tokenNum = object.tokenNum ?? 0;
    return message;
  },
};

function createBaseScheduleID(): ScheduleID {
  return { shardNum: 0, realmNum: 0, scheduleNum: 0 };
}

export const ScheduleID = {
  encode(
    message: ScheduleID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.shardNum !== 0) {
      writer.uint32(8).int64(message.shardNum);
    }
    if (message.realmNum !== 0) {
      writer.uint32(16).int64(message.realmNum);
    }
    if (message.scheduleNum !== 0) {
      writer.uint32(24).int64(message.scheduleNum);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ScheduleID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseScheduleID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.shardNum = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.realmNum = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.scheduleNum = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ScheduleID {
    return {
      shardNum: isSet(object.shardNum) ? Number(object.shardNum) : 0,
      realmNum: isSet(object.realmNum) ? Number(object.realmNum) : 0,
      scheduleNum: isSet(object.scheduleNum) ? Number(object.scheduleNum) : 0,
    };
  },

  toJSON(message: ScheduleID): unknown {
    const obj: any = {};
    message.shardNum !== undefined &&
      (obj.shardNum = Math.round(message.shardNum));
    message.realmNum !== undefined &&
      (obj.realmNum = Math.round(message.realmNum));
    message.scheduleNum !== undefined &&
      (obj.scheduleNum = Math.round(message.scheduleNum));
    return obj;
  },

  fromPartial(object: DeepPartial<ScheduleID>): ScheduleID {
    const message = createBaseScheduleID();
    message.shardNum = object.shardNum ?? 0;
    message.realmNum = object.realmNum ?? 0;
    message.scheduleNum = object.scheduleNum ?? 0;
    return message;
  },
};

function createBaseKey(): Key {
  return { key: undefined };
}

export const Key = {
  encode(message: Key, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key?.$case === "contractID") {
      ContractID.encode(
        message.key.contractID,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.key?.$case === "ed25519") {
      writer.uint32(18).bytes(message.key.ed25519);
    }
    if (message.key?.$case === "rsa3072") {
      writer.uint32(26).bytes(message.key.rsa3072);
    }
    if (message.key?.$case === "ecdsa384") {
      writer.uint32(34).bytes(message.key.ecdsa384);
    }
    if (message.key?.$case === "thresholdKey") {
      ThresholdKey.encode(
        message.key.thresholdKey,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.key?.$case === "keyList") {
      KeyList.encode(message.key.keyList, writer.uint32(50).fork()).ldelim();
    }
    if (message.key?.$case === "ECDSASecp256k1") {
      writer.uint32(58).bytes(message.key.ECDSASecp256k1);
    }
    if (message.key?.$case === "delegatableContractId") {
      ContractID.encode(
        message.key.delegatableContractId,
        writer.uint32(66).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Key {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = {
            $case: "contractID",
            contractID: ContractID.decode(reader, reader.uint32()),
          };
          break;
        case 2:
          message.key = { $case: "ed25519", ed25519: reader.bytes() };
          break;
        case 3:
          message.key = { $case: "rsa3072", rsa3072: reader.bytes() };
          break;
        case 4:
          message.key = { $case: "ecdsa384", ecdsa384: reader.bytes() };
          break;
        case 5:
          message.key = {
            $case: "thresholdKey",
            thresholdKey: ThresholdKey.decode(reader, reader.uint32()),
          };
          break;
        case 6:
          message.key = {
            $case: "keyList",
            keyList: KeyList.decode(reader, reader.uint32()),
          };
          break;
        case 7:
          message.key = {
            $case: "ECDSASecp256k1",
            ECDSASecp256k1: reader.bytes(),
          };
          break;
        case 8:
          message.key = {
            $case: "delegatableContractId",
            delegatableContractId: ContractID.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Key {
    return {
      key: isSet(object.contractID)
        ? {
            $case: "contractID",
            contractID: ContractID.fromJSON(object.contractID),
          }
        : isSet(object.ed25519)
        ? { $case: "ed25519", ed25519: bytesFromBase64(object.ed25519) }
        : isSet(object.RSA3072)
        ? { $case: "rsa3072", rsa3072: bytesFromBase64(object.RSA3072) }
        : isSet(object.ECDSA384)
        ? { $case: "ecdsa384", ecdsa384: bytesFromBase64(object.ECDSA384) }
        : isSet(object.thresholdKey)
        ? {
            $case: "thresholdKey",
            thresholdKey: ThresholdKey.fromJSON(object.thresholdKey),
          }
        : isSet(object.keyList)
        ? { $case: "keyList", keyList: KeyList.fromJSON(object.keyList) }
        : isSet(object.ECDSASecp256k1)
        ? {
            $case: "ECDSASecp256k1",
            ECDSASecp256k1: bytesFromBase64(object.ECDSASecp256k1),
          }
        : isSet(object.delegatableContractId)
        ? {
            $case: "delegatableContractId",
            delegatableContractId: ContractID.fromJSON(
              object.delegatableContractId
            ),
          }
        : undefined,
    };
  },

  toJSON(message: Key): unknown {
    const obj: any = {};
    message.key?.$case === "contractID" &&
      (obj.contractID = message.key?.contractID
        ? ContractID.toJSON(message.key?.contractID)
        : undefined);
    message.key?.$case === "ed25519" &&
      (obj.ed25519 =
        message.key?.ed25519 !== undefined
          ? base64FromBytes(message.key?.ed25519)
          : undefined);
    message.key?.$case === "rsa3072" &&
      (obj.RSA3072 =
        message.key?.rsa3072 !== undefined
          ? base64FromBytes(message.key?.rsa3072)
          : undefined);
    message.key?.$case === "ecdsa384" &&
      (obj.ECDSA384 =
        message.key?.ecdsa384 !== undefined
          ? base64FromBytes(message.key?.ecdsa384)
          : undefined);
    message.key?.$case === "thresholdKey" &&
      (obj.thresholdKey = message.key?.thresholdKey
        ? ThresholdKey.toJSON(message.key?.thresholdKey)
        : undefined);
    message.key?.$case === "keyList" &&
      (obj.keyList = message.key?.keyList
        ? KeyList.toJSON(message.key?.keyList)
        : undefined);
    message.key?.$case === "ECDSASecp256k1" &&
      (obj.ECDSASecp256k1 =
        message.key?.ECDSASecp256k1 !== undefined
          ? base64FromBytes(message.key?.ECDSASecp256k1)
          : undefined);
    message.key?.$case === "delegatableContractId" &&
      (obj.delegatableContractId = message.key?.delegatableContractId
        ? ContractID.toJSON(message.key?.delegatableContractId)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Key>): Key {
    const message = createBaseKey();
    if (
      object.key?.$case === "contractID" &&
      object.key?.contractID !== undefined &&
      object.key?.contractID !== null
    ) {
      message.key = {
        $case: "contractID",
        contractID: ContractID.fromPartial(object.key.contractID),
      };
    }
    if (
      object.key?.$case === "ed25519" &&
      object.key?.ed25519 !== undefined &&
      object.key?.ed25519 !== null
    ) {
      message.key = { $case: "ed25519", ed25519: object.key.ed25519 };
    }
    if (
      object.key?.$case === "rsa3072" &&
      object.key?.rsa3072 !== undefined &&
      object.key?.rsa3072 !== null
    ) {
      message.key = { $case: "rsa3072", rsa3072: object.key.rsa3072 };
    }
    if (
      object.key?.$case === "ecdsa384" &&
      object.key?.ecdsa384 !== undefined &&
      object.key?.ecdsa384 !== null
    ) {
      message.key = { $case: "ecdsa384", ecdsa384: object.key.ecdsa384 };
    }
    if (
      object.key?.$case === "thresholdKey" &&
      object.key?.thresholdKey !== undefined &&
      object.key?.thresholdKey !== null
    ) {
      message.key = {
        $case: "thresholdKey",
        thresholdKey: ThresholdKey.fromPartial(object.key.thresholdKey),
      };
    }
    if (
      object.key?.$case === "keyList" &&
      object.key?.keyList !== undefined &&
      object.key?.keyList !== null
    ) {
      message.key = {
        $case: "keyList",
        keyList: KeyList.fromPartial(object.key.keyList),
      };
    }
    if (
      object.key?.$case === "ECDSASecp256k1" &&
      object.key?.ECDSASecp256k1 !== undefined &&
      object.key?.ECDSASecp256k1 !== null
    ) {
      message.key = {
        $case: "ECDSASecp256k1",
        ECDSASecp256k1: object.key.ECDSASecp256k1,
      };
    }
    if (
      object.key?.$case === "delegatableContractId" &&
      object.key?.delegatableContractId !== undefined &&
      object.key?.delegatableContractId !== null
    ) {
      message.key = {
        $case: "delegatableContractId",
        delegatableContractId: ContractID.fromPartial(
          object.key.delegatableContractId
        ),
      };
    }
    return message;
  },
};

function createBaseThresholdKey(): ThresholdKey {
  return { threshold: 0, keys: undefined };
}

export const ThresholdKey = {
  encode(
    message: ThresholdKey,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.threshold !== 0) {
      writer.uint32(8).uint32(message.threshold);
    }
    if (message.keys !== undefined) {
      KeyList.encode(message.keys, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ThresholdKey {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThresholdKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.threshold = reader.uint32();
          break;
        case 2:
          message.keys = KeyList.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ThresholdKey {
    return {
      threshold: isSet(object.threshold) ? Number(object.threshold) : 0,
      keys: isSet(object.keys) ? KeyList.fromJSON(object.keys) : undefined,
    };
  },

  toJSON(message: ThresholdKey): unknown {
    const obj: any = {};
    message.threshold !== undefined &&
      (obj.threshold = Math.round(message.threshold));
    message.keys !== undefined &&
      (obj.keys = message.keys ? KeyList.toJSON(message.keys) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ThresholdKey>): ThresholdKey {
    const message = createBaseThresholdKey();
    message.threshold = object.threshold ?? 0;
    message.keys =
      object.keys !== undefined && object.keys !== null
        ? KeyList.fromPartial(object.keys)
        : undefined;
    return message;
  },
};

function createBaseKeyList(): KeyList {
  return { keys: [] };
}

export const KeyList = {
  encode(
    message: KeyList,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.keys) {
      Key.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.keys.push(Key.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): KeyList {
    return {
      keys: Array.isArray(object?.keys)
        ? object.keys.map((e: any) => Key.fromJSON(e))
        : [],
    };
  },

  toJSON(message: KeyList): unknown {
    const obj: any = {};
    if (message.keys) {
      obj.keys = message.keys.map((e) => (e ? Key.toJSON(e) : undefined));
    } else {
      obj.keys = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<KeyList>): KeyList {
    const message = createBaseKeyList();
    message.keys = object.keys?.map((e) => Key.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSignature(): Signature {
  return { signature: undefined };
}

export const Signature = {
  encode(
    message: Signature,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.signature?.$case === "contract") {
      writer.uint32(10).bytes(message.signature.contract);
    }
    if (message.signature?.$case === "ed25519") {
      writer.uint32(18).bytes(message.signature.ed25519);
    }
    if (message.signature?.$case === "rsa3072") {
      writer.uint32(26).bytes(message.signature.rsa3072);
    }
    if (message.signature?.$case === "ecdsa384") {
      writer.uint32(34).bytes(message.signature.ecdsa384);
    }
    if (message.signature?.$case === "thresholdSignature") {
      ThresholdSignature.encode(
        message.signature.thresholdSignature,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.signature?.$case === "signatureList") {
      SignatureList.encode(
        message.signature.signatureList,
        writer.uint32(50).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Signature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signature = { $case: "contract", contract: reader.bytes() };
          break;
        case 2:
          message.signature = { $case: "ed25519", ed25519: reader.bytes() };
          break;
        case 3:
          message.signature = { $case: "rsa3072", rsa3072: reader.bytes() };
          break;
        case 4:
          message.signature = { $case: "ecdsa384", ecdsa384: reader.bytes() };
          break;
        case 5:
          message.signature = {
            $case: "thresholdSignature",
            thresholdSignature: ThresholdSignature.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 6:
          message.signature = {
            $case: "signatureList",
            signatureList: SignatureList.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Signature {
    return {
      signature: isSet(object.contract)
        ? { $case: "contract", contract: bytesFromBase64(object.contract) }
        : isSet(object.ed25519)
        ? { $case: "ed25519", ed25519: bytesFromBase64(object.ed25519) }
        : isSet(object.RSA3072)
        ? { $case: "rsa3072", rsa3072: bytesFromBase64(object.RSA3072) }
        : isSet(object.ECDSA384)
        ? { $case: "ecdsa384", ecdsa384: bytesFromBase64(object.ECDSA384) }
        : isSet(object.thresholdSignature)
        ? {
            $case: "thresholdSignature",
            thresholdSignature: ThresholdSignature.fromJSON(
              object.thresholdSignature
            ),
          }
        : isSet(object.signatureList)
        ? {
            $case: "signatureList",
            signatureList: SignatureList.fromJSON(object.signatureList),
          }
        : undefined,
    };
  },

  toJSON(message: Signature): unknown {
    const obj: any = {};
    message.signature?.$case === "contract" &&
      (obj.contract =
        message.signature?.contract !== undefined
          ? base64FromBytes(message.signature?.contract)
          : undefined);
    message.signature?.$case === "ed25519" &&
      (obj.ed25519 =
        message.signature?.ed25519 !== undefined
          ? base64FromBytes(message.signature?.ed25519)
          : undefined);
    message.signature?.$case === "rsa3072" &&
      (obj.RSA3072 =
        message.signature?.rsa3072 !== undefined
          ? base64FromBytes(message.signature?.rsa3072)
          : undefined);
    message.signature?.$case === "ecdsa384" &&
      (obj.ECDSA384 =
        message.signature?.ecdsa384 !== undefined
          ? base64FromBytes(message.signature?.ecdsa384)
          : undefined);
    message.signature?.$case === "thresholdSignature" &&
      (obj.thresholdSignature = message.signature?.thresholdSignature
        ? ThresholdSignature.toJSON(message.signature?.thresholdSignature)
        : undefined);
    message.signature?.$case === "signatureList" &&
      (obj.signatureList = message.signature?.signatureList
        ? SignatureList.toJSON(message.signature?.signatureList)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Signature>): Signature {
    const message = createBaseSignature();
    if (
      object.signature?.$case === "contract" &&
      object.signature?.contract !== undefined &&
      object.signature?.contract !== null
    ) {
      message.signature = {
        $case: "contract",
        contract: object.signature.contract,
      };
    }
    if (
      object.signature?.$case === "ed25519" &&
      object.signature?.ed25519 !== undefined &&
      object.signature?.ed25519 !== null
    ) {
      message.signature = {
        $case: "ed25519",
        ed25519: object.signature.ed25519,
      };
    }
    if (
      object.signature?.$case === "rsa3072" &&
      object.signature?.rsa3072 !== undefined &&
      object.signature?.rsa3072 !== null
    ) {
      message.signature = {
        $case: "rsa3072",
        rsa3072: object.signature.rsa3072,
      };
    }
    if (
      object.signature?.$case === "ecdsa384" &&
      object.signature?.ecdsa384 !== undefined &&
      object.signature?.ecdsa384 !== null
    ) {
      message.signature = {
        $case: "ecdsa384",
        ecdsa384: object.signature.ecdsa384,
      };
    }
    if (
      object.signature?.$case === "thresholdSignature" &&
      object.signature?.thresholdSignature !== undefined &&
      object.signature?.thresholdSignature !== null
    ) {
      message.signature = {
        $case: "thresholdSignature",
        thresholdSignature: ThresholdSignature.fromPartial(
          object.signature.thresholdSignature
        ),
      };
    }
    if (
      object.signature?.$case === "signatureList" &&
      object.signature?.signatureList !== undefined &&
      object.signature?.signatureList !== null
    ) {
      message.signature = {
        $case: "signatureList",
        signatureList: SignatureList.fromPartial(
          object.signature.signatureList
        ),
      };
    }
    return message;
  },
};

function createBaseThresholdSignature(): ThresholdSignature {
  return { sigs: undefined };
}

export const ThresholdSignature = {
  encode(
    message: ThresholdSignature,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.sigs !== undefined) {
      SignatureList.encode(message.sigs, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ThresholdSignature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThresholdSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.sigs = SignatureList.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ThresholdSignature {
    return {
      sigs: isSet(object.sigs)
        ? SignatureList.fromJSON(object.sigs)
        : undefined,
    };
  },

  toJSON(message: ThresholdSignature): unknown {
    const obj: any = {};
    message.sigs !== undefined &&
      (obj.sigs = message.sigs
        ? SignatureList.toJSON(message.sigs)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ThresholdSignature>): ThresholdSignature {
    const message = createBaseThresholdSignature();
    message.sigs =
      object.sigs !== undefined && object.sigs !== null
        ? SignatureList.fromPartial(object.sigs)
        : undefined;
    return message;
  },
};

function createBaseSignatureList(): SignatureList {
  return { sigs: [] };
}

export const SignatureList = {
  encode(
    message: SignatureList,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.sigs) {
      Signature.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignatureList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignatureList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.sigs.push(Signature.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignatureList {
    return {
      sigs: Array.isArray(object?.sigs)
        ? object.sigs.map((e: any) => Signature.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SignatureList): unknown {
    const obj: any = {};
    if (message.sigs) {
      obj.sigs = message.sigs.map((e) => (e ? Signature.toJSON(e) : undefined));
    } else {
      obj.sigs = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<SignatureList>): SignatureList {
    const message = createBaseSignatureList();
    message.sigs = object.sigs?.map((e) => Signature.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSignaturePair(): SignaturePair {
  return { pubKeyPrefix: new Uint8Array(), signature: undefined };
}

export const SignaturePair = {
  encode(
    message: SignaturePair,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pubKeyPrefix.length !== 0) {
      writer.uint32(10).bytes(message.pubKeyPrefix);
    }
    if (message.signature?.$case === "contract") {
      writer.uint32(18).bytes(message.signature.contract);
    }
    if (message.signature?.$case === "ed25519") {
      writer.uint32(26).bytes(message.signature.ed25519);
    }
    if (message.signature?.$case === "rsa3072") {
      writer.uint32(34).bytes(message.signature.rsa3072);
    }
    if (message.signature?.$case === "ecdsa384") {
      writer.uint32(42).bytes(message.signature.ecdsa384);
    }
    if (message.signature?.$case === "ECDSASecp256k1") {
      writer.uint32(50).bytes(message.signature.ECDSASecp256k1);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignaturePair {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignaturePair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pubKeyPrefix = reader.bytes();
          break;
        case 2:
          message.signature = { $case: "contract", contract: reader.bytes() };
          break;
        case 3:
          message.signature = { $case: "ed25519", ed25519: reader.bytes() };
          break;
        case 4:
          message.signature = { $case: "rsa3072", rsa3072: reader.bytes() };
          break;
        case 5:
          message.signature = { $case: "ecdsa384", ecdsa384: reader.bytes() };
          break;
        case 6:
          message.signature = {
            $case: "ECDSASecp256k1",
            ECDSASecp256k1: reader.bytes(),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignaturePair {
    return {
      pubKeyPrefix: isSet(object.pubKeyPrefix)
        ? bytesFromBase64(object.pubKeyPrefix)
        : new Uint8Array(),
      signature: isSet(object.contract)
        ? { $case: "contract", contract: bytesFromBase64(object.contract) }
        : isSet(object.ed25519)
        ? { $case: "ed25519", ed25519: bytesFromBase64(object.ed25519) }
        : isSet(object.RSA3072)
        ? { $case: "rsa3072", rsa3072: bytesFromBase64(object.RSA3072) }
        : isSet(object.ECDSA384)
        ? { $case: "ecdsa384", ecdsa384: bytesFromBase64(object.ECDSA384) }
        : isSet(object.ECDSASecp256k1)
        ? {
            $case: "ECDSASecp256k1",
            ECDSASecp256k1: bytesFromBase64(object.ECDSASecp256k1),
          }
        : undefined,
    };
  },

  toJSON(message: SignaturePair): unknown {
    const obj: any = {};
    message.pubKeyPrefix !== undefined &&
      (obj.pubKeyPrefix = base64FromBytes(
        message.pubKeyPrefix !== undefined
          ? message.pubKeyPrefix
          : new Uint8Array()
      ));
    message.signature?.$case === "contract" &&
      (obj.contract =
        message.signature?.contract !== undefined
          ? base64FromBytes(message.signature?.contract)
          : undefined);
    message.signature?.$case === "ed25519" &&
      (obj.ed25519 =
        message.signature?.ed25519 !== undefined
          ? base64FromBytes(message.signature?.ed25519)
          : undefined);
    message.signature?.$case === "rsa3072" &&
      (obj.RSA3072 =
        message.signature?.rsa3072 !== undefined
          ? base64FromBytes(message.signature?.rsa3072)
          : undefined);
    message.signature?.$case === "ecdsa384" &&
      (obj.ECDSA384 =
        message.signature?.ecdsa384 !== undefined
          ? base64FromBytes(message.signature?.ecdsa384)
          : undefined);
    message.signature?.$case === "ECDSASecp256k1" &&
      (obj.ECDSASecp256k1 =
        message.signature?.ECDSASecp256k1 !== undefined
          ? base64FromBytes(message.signature?.ECDSASecp256k1)
          : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<SignaturePair>): SignaturePair {
    const message = createBaseSignaturePair();
    message.pubKeyPrefix = object.pubKeyPrefix ?? new Uint8Array();
    if (
      object.signature?.$case === "contract" &&
      object.signature?.contract !== undefined &&
      object.signature?.contract !== null
    ) {
      message.signature = {
        $case: "contract",
        contract: object.signature.contract,
      };
    }
    if (
      object.signature?.$case === "ed25519" &&
      object.signature?.ed25519 !== undefined &&
      object.signature?.ed25519 !== null
    ) {
      message.signature = {
        $case: "ed25519",
        ed25519: object.signature.ed25519,
      };
    }
    if (
      object.signature?.$case === "rsa3072" &&
      object.signature?.rsa3072 !== undefined &&
      object.signature?.rsa3072 !== null
    ) {
      message.signature = {
        $case: "rsa3072",
        rsa3072: object.signature.rsa3072,
      };
    }
    if (
      object.signature?.$case === "ecdsa384" &&
      object.signature?.ecdsa384 !== undefined &&
      object.signature?.ecdsa384 !== null
    ) {
      message.signature = {
        $case: "ecdsa384",
        ecdsa384: object.signature.ecdsa384,
      };
    }
    if (
      object.signature?.$case === "ECDSASecp256k1" &&
      object.signature?.ECDSASecp256k1 !== undefined &&
      object.signature?.ECDSASecp256k1 !== null
    ) {
      message.signature = {
        $case: "ECDSASecp256k1",
        ECDSASecp256k1: object.signature.ECDSASecp256k1,
      };
    }
    return message;
  },
};

function createBaseSignatureMap(): SignatureMap {
  return { sigPair: [] };
}

export const SignatureMap = {
  encode(
    message: SignatureMap,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.sigPair) {
      SignaturePair.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignatureMap {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignatureMap();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sigPair.push(SignaturePair.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignatureMap {
    return {
      sigPair: Array.isArray(object?.sigPair)
        ? object.sigPair.map((e: any) => SignaturePair.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SignatureMap): unknown {
    const obj: any = {};
    if (message.sigPair) {
      obj.sigPair = message.sigPair.map((e) =>
        e ? SignaturePair.toJSON(e) : undefined
      );
    } else {
      obj.sigPair = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<SignatureMap>): SignatureMap {
    const message = createBaseSignatureMap();
    message.sigPair =
      object.sigPair?.map((e) => SignaturePair.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFeeComponents(): FeeComponents {
  return {
    min: 0,
    max: 0,
    constant: 0,
    bpt: 0,
    vpt: 0,
    rbh: 0,
    sbh: 0,
    gas: 0,
    tv: 0,
    bpr: 0,
    sbpr: 0,
  };
}

export const FeeComponents = {
  encode(
    message: FeeComponents,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.min !== 0) {
      writer.uint32(8).int64(message.min);
    }
    if (message.max !== 0) {
      writer.uint32(16).int64(message.max);
    }
    if (message.constant !== 0) {
      writer.uint32(24).int64(message.constant);
    }
    if (message.bpt !== 0) {
      writer.uint32(32).int64(message.bpt);
    }
    if (message.vpt !== 0) {
      writer.uint32(40).int64(message.vpt);
    }
    if (message.rbh !== 0) {
      writer.uint32(48).int64(message.rbh);
    }
    if (message.sbh !== 0) {
      writer.uint32(56).int64(message.sbh);
    }
    if (message.gas !== 0) {
      writer.uint32(64).int64(message.gas);
    }
    if (message.tv !== 0) {
      writer.uint32(72).int64(message.tv);
    }
    if (message.bpr !== 0) {
      writer.uint32(80).int64(message.bpr);
    }
    if (message.sbpr !== 0) {
      writer.uint32(88).int64(message.sbpr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeComponents {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeComponents();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.min = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.max = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.constant = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.bpt = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.vpt = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.rbh = longToNumber(reader.int64() as Long);
          break;
        case 7:
          message.sbh = longToNumber(reader.int64() as Long);
          break;
        case 8:
          message.gas = longToNumber(reader.int64() as Long);
          break;
        case 9:
          message.tv = longToNumber(reader.int64() as Long);
          break;
        case 10:
          message.bpr = longToNumber(reader.int64() as Long);
          break;
        case 11:
          message.sbpr = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeeComponents {
    return {
      min: isSet(object.min) ? Number(object.min) : 0,
      max: isSet(object.max) ? Number(object.max) : 0,
      constant: isSet(object.constant) ? Number(object.constant) : 0,
      bpt: isSet(object.bpt) ? Number(object.bpt) : 0,
      vpt: isSet(object.vpt) ? Number(object.vpt) : 0,
      rbh: isSet(object.rbh) ? Number(object.rbh) : 0,
      sbh: isSet(object.sbh) ? Number(object.sbh) : 0,
      gas: isSet(object.gas) ? Number(object.gas) : 0,
      tv: isSet(object.tv) ? Number(object.tv) : 0,
      bpr: isSet(object.bpr) ? Number(object.bpr) : 0,
      sbpr: isSet(object.sbpr) ? Number(object.sbpr) : 0,
    };
  },

  toJSON(message: FeeComponents): unknown {
    const obj: any = {};
    message.min !== undefined && (obj.min = Math.round(message.min));
    message.max !== undefined && (obj.max = Math.round(message.max));
    message.constant !== undefined &&
      (obj.constant = Math.round(message.constant));
    message.bpt !== undefined && (obj.bpt = Math.round(message.bpt));
    message.vpt !== undefined && (obj.vpt = Math.round(message.vpt));
    message.rbh !== undefined && (obj.rbh = Math.round(message.rbh));
    message.sbh !== undefined && (obj.sbh = Math.round(message.sbh));
    message.gas !== undefined && (obj.gas = Math.round(message.gas));
    message.tv !== undefined && (obj.tv = Math.round(message.tv));
    message.bpr !== undefined && (obj.bpr = Math.round(message.bpr));
    message.sbpr !== undefined && (obj.sbpr = Math.round(message.sbpr));
    return obj;
  },

  fromPartial(object: DeepPartial<FeeComponents>): FeeComponents {
    const message = createBaseFeeComponents();
    message.min = object.min ?? 0;
    message.max = object.max ?? 0;
    message.constant = object.constant ?? 0;
    message.bpt = object.bpt ?? 0;
    message.vpt = object.vpt ?? 0;
    message.rbh = object.rbh ?? 0;
    message.sbh = object.sbh ?? 0;
    message.gas = object.gas ?? 0;
    message.tv = object.tv ?? 0;
    message.bpr = object.bpr ?? 0;
    message.sbpr = object.sbpr ?? 0;
    return message;
  },
};

function createBaseTransactionFeeSchedule(): TransactionFeeSchedule {
  return { hederaFunctionality: 0, feeData: undefined, fees: [] };
}

export const TransactionFeeSchedule = {
  encode(
    message: TransactionFeeSchedule,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.hederaFunctionality !== 0) {
      writer.uint32(8).int32(message.hederaFunctionality);
    }
    if (message.feeData !== undefined) {
      FeeData.encode(message.feeData, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.fees) {
      FeeData.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TransactionFeeSchedule {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionFeeSchedule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hederaFunctionality = reader.int32() as any;
          break;
        case 2:
          message.feeData = FeeData.decode(reader, reader.uint32());
          break;
        case 3:
          message.fees.push(FeeData.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionFeeSchedule {
    return {
      hederaFunctionality: isSet(object.hederaFunctionality)
        ? hederaFunctionalityFromJSON(object.hederaFunctionality)
        : 0,
      feeData: isSet(object.feeData)
        ? FeeData.fromJSON(object.feeData)
        : undefined,
      fees: Array.isArray(object?.fees)
        ? object.fees.map((e: any) => FeeData.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TransactionFeeSchedule): unknown {
    const obj: any = {};
    message.hederaFunctionality !== undefined &&
      (obj.hederaFunctionality = hederaFunctionalityToJSON(
        message.hederaFunctionality
      ));
    message.feeData !== undefined &&
      (obj.feeData = message.feeData
        ? FeeData.toJSON(message.feeData)
        : undefined);
    if (message.fees) {
      obj.fees = message.fees.map((e) => (e ? FeeData.toJSON(e) : undefined));
    } else {
      obj.fees = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<TransactionFeeSchedule>
  ): TransactionFeeSchedule {
    const message = createBaseTransactionFeeSchedule();
    message.hederaFunctionality = object.hederaFunctionality ?? 0;
    message.feeData =
      object.feeData !== undefined && object.feeData !== null
        ? FeeData.fromPartial(object.feeData)
        : undefined;
    message.fees = object.fees?.map((e) => FeeData.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFeeData(): FeeData {
  return {
    nodedata: undefined,
    networkdata: undefined,
    servicedata: undefined,
    subType: 0,
  };
}

export const FeeData = {
  encode(
    message: FeeData,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.nodedata !== undefined) {
      FeeComponents.encode(message.nodedata, writer.uint32(10).fork()).ldelim();
    }
    if (message.networkdata !== undefined) {
      FeeComponents.encode(
        message.networkdata,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.servicedata !== undefined) {
      FeeComponents.encode(
        message.servicedata,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.subType !== 0) {
      writer.uint32(32).int32(message.subType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nodedata = FeeComponents.decode(reader, reader.uint32());
          break;
        case 2:
          message.networkdata = FeeComponents.decode(reader, reader.uint32());
          break;
        case 3:
          message.servicedata = FeeComponents.decode(reader, reader.uint32());
          break;
        case 4:
          message.subType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeeData {
    return {
      nodedata: isSet(object.nodedata)
        ? FeeComponents.fromJSON(object.nodedata)
        : undefined,
      networkdata: isSet(object.networkdata)
        ? FeeComponents.fromJSON(object.networkdata)
        : undefined,
      servicedata: isSet(object.servicedata)
        ? FeeComponents.fromJSON(object.servicedata)
        : undefined,
      subType: isSet(object.subType) ? subTypeFromJSON(object.subType) : 0,
    };
  },

  toJSON(message: FeeData): unknown {
    const obj: any = {};
    message.nodedata !== undefined &&
      (obj.nodedata = message.nodedata
        ? FeeComponents.toJSON(message.nodedata)
        : undefined);
    message.networkdata !== undefined &&
      (obj.networkdata = message.networkdata
        ? FeeComponents.toJSON(message.networkdata)
        : undefined);
    message.servicedata !== undefined &&
      (obj.servicedata = message.servicedata
        ? FeeComponents.toJSON(message.servicedata)
        : undefined);
    message.subType !== undefined &&
      (obj.subType = subTypeToJSON(message.subType));
    return obj;
  },

  fromPartial(object: DeepPartial<FeeData>): FeeData {
    const message = createBaseFeeData();
    message.nodedata =
      object.nodedata !== undefined && object.nodedata !== null
        ? FeeComponents.fromPartial(object.nodedata)
        : undefined;
    message.networkdata =
      object.networkdata !== undefined && object.networkdata !== null
        ? FeeComponents.fromPartial(object.networkdata)
        : undefined;
    message.servicedata =
      object.servicedata !== undefined && object.servicedata !== null
        ? FeeComponents.fromPartial(object.servicedata)
        : undefined;
    message.subType = object.subType ?? 0;
    return message;
  },
};

function createBaseFeeSchedule(): FeeSchedule {
  return { transactionFeeSchedule: [], expiryTime: undefined };
}

export const FeeSchedule = {
  encode(
    message: FeeSchedule,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.transactionFeeSchedule) {
      TransactionFeeSchedule.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.expiryTime !== undefined) {
      TimestampSeconds.encode(
        message.expiryTime,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeeSchedule {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeeSchedule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionFeeSchedule.push(
            TransactionFeeSchedule.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.expiryTime = TimestampSeconds.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeeSchedule {
    return {
      transactionFeeSchedule: Array.isArray(object?.transactionFeeSchedule)
        ? object.transactionFeeSchedule.map((e: any) =>
            TransactionFeeSchedule.fromJSON(e)
          )
        : [],
      expiryTime: isSet(object.expiryTime)
        ? TimestampSeconds.fromJSON(object.expiryTime)
        : undefined,
    };
  },

  toJSON(message: FeeSchedule): unknown {
    const obj: any = {};
    if (message.transactionFeeSchedule) {
      obj.transactionFeeSchedule = message.transactionFeeSchedule.map((e) =>
        e ? TransactionFeeSchedule.toJSON(e) : undefined
      );
    } else {
      obj.transactionFeeSchedule = [];
    }
    message.expiryTime !== undefined &&
      (obj.expiryTime = message.expiryTime
        ? TimestampSeconds.toJSON(message.expiryTime)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<FeeSchedule>): FeeSchedule {
    const message = createBaseFeeSchedule();
    message.transactionFeeSchedule =
      object.transactionFeeSchedule?.map((e) =>
        TransactionFeeSchedule.fromPartial(e)
      ) || [];
    message.expiryTime =
      object.expiryTime !== undefined && object.expiryTime !== null
        ? TimestampSeconds.fromPartial(object.expiryTime)
        : undefined;
    return message;
  },
};

function createBaseCurrentAndNextFeeSchedule(): CurrentAndNextFeeSchedule {
  return { currentFeeSchedule: undefined, nextFeeSchedule: undefined };
}

export const CurrentAndNextFeeSchedule = {
  encode(
    message: CurrentAndNextFeeSchedule,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.currentFeeSchedule !== undefined) {
      FeeSchedule.encode(
        message.currentFeeSchedule,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.nextFeeSchedule !== undefined) {
      FeeSchedule.encode(
        message.nextFeeSchedule,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CurrentAndNextFeeSchedule {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentAndNextFeeSchedule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.currentFeeSchedule = FeeSchedule.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.nextFeeSchedule = FeeSchedule.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CurrentAndNextFeeSchedule {
    return {
      currentFeeSchedule: isSet(object.currentFeeSchedule)
        ? FeeSchedule.fromJSON(object.currentFeeSchedule)
        : undefined,
      nextFeeSchedule: isSet(object.nextFeeSchedule)
        ? FeeSchedule.fromJSON(object.nextFeeSchedule)
        : undefined,
    };
  },

  toJSON(message: CurrentAndNextFeeSchedule): unknown {
    const obj: any = {};
    message.currentFeeSchedule !== undefined &&
      (obj.currentFeeSchedule = message.currentFeeSchedule
        ? FeeSchedule.toJSON(message.currentFeeSchedule)
        : undefined);
    message.nextFeeSchedule !== undefined &&
      (obj.nextFeeSchedule = message.nextFeeSchedule
        ? FeeSchedule.toJSON(message.nextFeeSchedule)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CurrentAndNextFeeSchedule>
  ): CurrentAndNextFeeSchedule {
    const message = createBaseCurrentAndNextFeeSchedule();
    message.currentFeeSchedule =
      object.currentFeeSchedule !== undefined &&
      object.currentFeeSchedule !== null
        ? FeeSchedule.fromPartial(object.currentFeeSchedule)
        : undefined;
    message.nextFeeSchedule =
      object.nextFeeSchedule !== undefined && object.nextFeeSchedule !== null
        ? FeeSchedule.fromPartial(object.nextFeeSchedule)
        : undefined;
    return message;
  },
};

function createBaseServiceEndpoint(): ServiceEndpoint {
  return { ipAddressV4: new Uint8Array(), port: 0 };
}

export const ServiceEndpoint = {
  encode(
    message: ServiceEndpoint,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ipAddressV4.length !== 0) {
      writer.uint32(10).bytes(message.ipAddressV4);
    }
    if (message.port !== 0) {
      writer.uint32(16).int32(message.port);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceEndpoint {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceEndpoint();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ipAddressV4 = reader.bytes();
          break;
        case 2:
          message.port = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ServiceEndpoint {
    return {
      ipAddressV4: isSet(object.ipAddressV4)
        ? bytesFromBase64(object.ipAddressV4)
        : new Uint8Array(),
      port: isSet(object.port) ? Number(object.port) : 0,
    };
  },

  toJSON(message: ServiceEndpoint): unknown {
    const obj: any = {};
    message.ipAddressV4 !== undefined &&
      (obj.ipAddressV4 = base64FromBytes(
        message.ipAddressV4 !== undefined
          ? message.ipAddressV4
          : new Uint8Array()
      ));
    message.port !== undefined && (obj.port = Math.round(message.port));
    return obj;
  },

  fromPartial(object: DeepPartial<ServiceEndpoint>): ServiceEndpoint {
    const message = createBaseServiceEndpoint();
    message.ipAddressV4 = object.ipAddressV4 ?? new Uint8Array();
    message.port = object.port ?? 0;
    return message;
  },
};

function createBaseNodeAddress(): NodeAddress {
  return {
    ipAddress: new Uint8Array(),
    portno: 0,
    memo: new Uint8Array(),
    RSAPubKey: "",
    nodeId: 0,
    nodeAccountId: undefined,
    nodeCertHash: new Uint8Array(),
    serviceEndpoint: [],
    description: "",
    stake: 0,
  };
}

export const NodeAddress = {
  encode(
    message: NodeAddress,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ipAddress.length !== 0) {
      writer.uint32(10).bytes(message.ipAddress);
    }
    if (message.portno !== 0) {
      writer.uint32(16).int32(message.portno);
    }
    if (message.memo.length !== 0) {
      writer.uint32(26).bytes(message.memo);
    }
    if (message.RSAPubKey !== "") {
      writer.uint32(34).string(message.RSAPubKey);
    }
    if (message.nodeId !== 0) {
      writer.uint32(40).int64(message.nodeId);
    }
    if (message.nodeAccountId !== undefined) {
      AccountID.encode(
        message.nodeAccountId,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.nodeCertHash.length !== 0) {
      writer.uint32(58).bytes(message.nodeCertHash);
    }
    for (const v of message.serviceEndpoint) {
      ServiceEndpoint.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    if (message.description !== "") {
      writer.uint32(74).string(message.description);
    }
    if (message.stake !== 0) {
      writer.uint32(80).int64(message.stake);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeAddress {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ipAddress = reader.bytes();
          break;
        case 2:
          message.portno = reader.int32();
          break;
        case 3:
          message.memo = reader.bytes();
          break;
        case 4:
          message.RSAPubKey = reader.string();
          break;
        case 5:
          message.nodeId = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.nodeAccountId = AccountID.decode(reader, reader.uint32());
          break;
        case 7:
          message.nodeCertHash = reader.bytes();
          break;
        case 8:
          message.serviceEndpoint.push(
            ServiceEndpoint.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.description = reader.string();
          break;
        case 10:
          message.stake = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NodeAddress {
    return {
      ipAddress: isSet(object.ipAddress)
        ? bytesFromBase64(object.ipAddress)
        : new Uint8Array(),
      portno: isSet(object.portno) ? Number(object.portno) : 0,
      memo: isSet(object.memo)
        ? bytesFromBase64(object.memo)
        : new Uint8Array(),
      RSAPubKey: isSet(object.RSAPubKey) ? String(object.RSAPubKey) : "",
      nodeId: isSet(object.nodeId) ? Number(object.nodeId) : 0,
      nodeAccountId: isSet(object.nodeAccountId)
        ? AccountID.fromJSON(object.nodeAccountId)
        : undefined,
      nodeCertHash: isSet(object.nodeCertHash)
        ? bytesFromBase64(object.nodeCertHash)
        : new Uint8Array(),
      serviceEndpoint: Array.isArray(object?.serviceEndpoint)
        ? object.serviceEndpoint.map((e: any) => ServiceEndpoint.fromJSON(e))
        : [],
      description: isSet(object.description) ? String(object.description) : "",
      stake: isSet(object.stake) ? Number(object.stake) : 0,
    };
  },

  toJSON(message: NodeAddress): unknown {
    const obj: any = {};
    message.ipAddress !== undefined &&
      (obj.ipAddress = base64FromBytes(
        message.ipAddress !== undefined ? message.ipAddress : new Uint8Array()
      ));
    message.portno !== undefined && (obj.portno = Math.round(message.portno));
    message.memo !== undefined &&
      (obj.memo = base64FromBytes(
        message.memo !== undefined ? message.memo : new Uint8Array()
      ));
    message.RSAPubKey !== undefined && (obj.RSAPubKey = message.RSAPubKey);
    message.nodeId !== undefined && (obj.nodeId = Math.round(message.nodeId));
    message.nodeAccountId !== undefined &&
      (obj.nodeAccountId = message.nodeAccountId
        ? AccountID.toJSON(message.nodeAccountId)
        : undefined);
    message.nodeCertHash !== undefined &&
      (obj.nodeCertHash = base64FromBytes(
        message.nodeCertHash !== undefined
          ? message.nodeCertHash
          : new Uint8Array()
      ));
    if (message.serviceEndpoint) {
      obj.serviceEndpoint = message.serviceEndpoint.map((e) =>
        e ? ServiceEndpoint.toJSON(e) : undefined
      );
    } else {
      obj.serviceEndpoint = [];
    }
    message.description !== undefined &&
      (obj.description = message.description);
    message.stake !== undefined && (obj.stake = Math.round(message.stake));
    return obj;
  },

  fromPartial(object: DeepPartial<NodeAddress>): NodeAddress {
    const message = createBaseNodeAddress();
    message.ipAddress = object.ipAddress ?? new Uint8Array();
    message.portno = object.portno ?? 0;
    message.memo = object.memo ?? new Uint8Array();
    message.RSAPubKey = object.RSAPubKey ?? "";
    message.nodeId = object.nodeId ?? 0;
    message.nodeAccountId =
      object.nodeAccountId !== undefined && object.nodeAccountId !== null
        ? AccountID.fromPartial(object.nodeAccountId)
        : undefined;
    message.nodeCertHash = object.nodeCertHash ?? new Uint8Array();
    message.serviceEndpoint =
      object.serviceEndpoint?.map((e) => ServiceEndpoint.fromPartial(e)) || [];
    message.description = object.description ?? "";
    message.stake = object.stake ?? 0;
    return message;
  },
};

function createBaseNodeAddressBook(): NodeAddressBook {
  return { nodeAddress: [] };
}

export const NodeAddressBook = {
  encode(
    message: NodeAddressBook,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.nodeAddress) {
      NodeAddress.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeAddressBook {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeAddressBook();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nodeAddress.push(NodeAddress.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NodeAddressBook {
    return {
      nodeAddress: Array.isArray(object?.nodeAddress)
        ? object.nodeAddress.map((e: any) => NodeAddress.fromJSON(e))
        : [],
    };
  },

  toJSON(message: NodeAddressBook): unknown {
    const obj: any = {};
    if (message.nodeAddress) {
      obj.nodeAddress = message.nodeAddress.map((e) =>
        e ? NodeAddress.toJSON(e) : undefined
      );
    } else {
      obj.nodeAddress = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<NodeAddressBook>): NodeAddressBook {
    const message = createBaseNodeAddressBook();
    message.nodeAddress =
      object.nodeAddress?.map((e) => NodeAddress.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSemanticVersion(): SemanticVersion {
  return { major: 0, minor: 0, patch: 0, pre: "", build: "" };
}

export const SemanticVersion = {
  encode(
    message: SemanticVersion,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.major !== 0) {
      writer.uint32(8).int32(message.major);
    }
    if (message.minor !== 0) {
      writer.uint32(16).int32(message.minor);
    }
    if (message.patch !== 0) {
      writer.uint32(24).int32(message.patch);
    }
    if (message.pre !== "") {
      writer.uint32(34).string(message.pre);
    }
    if (message.build !== "") {
      writer.uint32(42).string(message.build);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SemanticVersion {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSemanticVersion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.major = reader.int32();
          break;
        case 2:
          message.minor = reader.int32();
          break;
        case 3:
          message.patch = reader.int32();
          break;
        case 4:
          message.pre = reader.string();
          break;
        case 5:
          message.build = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SemanticVersion {
    return {
      major: isSet(object.major) ? Number(object.major) : 0,
      minor: isSet(object.minor) ? Number(object.minor) : 0,
      patch: isSet(object.patch) ? Number(object.patch) : 0,
      pre: isSet(object.pre) ? String(object.pre) : "",
      build: isSet(object.build) ? String(object.build) : "",
    };
  },

  toJSON(message: SemanticVersion): unknown {
    const obj: any = {};
    message.major !== undefined && (obj.major = Math.round(message.major));
    message.minor !== undefined && (obj.minor = Math.round(message.minor));
    message.patch !== undefined && (obj.patch = Math.round(message.patch));
    message.pre !== undefined && (obj.pre = message.pre);
    message.build !== undefined && (obj.build = message.build);
    return obj;
  },

  fromPartial(object: DeepPartial<SemanticVersion>): SemanticVersion {
    const message = createBaseSemanticVersion();
    message.major = object.major ?? 0;
    message.minor = object.minor ?? 0;
    message.patch = object.patch ?? 0;
    message.pre = object.pre ?? "";
    message.build = object.build ?? "";
    return message;
  },
};

function createBaseSetting(): Setting {
  return { name: "", value: "", data: new Uint8Array() };
}

export const Setting = {
  encode(
    message: Setting,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    if (message.data.length !== 0) {
      writer.uint32(26).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Setting {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetting();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        case 3:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Setting {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      value: isSet(object.value) ? String(object.value) : "",
      data: isSet(object.data)
        ? bytesFromBase64(object.data)
        : new Uint8Array(),
    };
  },

  toJSON(message: Setting): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.value !== undefined && (obj.value = message.value);
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<Setting>): Setting {
    const message = createBaseSetting();
    message.name = object.name ?? "";
    message.value = object.value ?? "";
    message.data = object.data ?? new Uint8Array();
    return message;
  },
};

function createBaseServicesConfigurationList(): ServicesConfigurationList {
  return { nameValue: [] };
}

export const ServicesConfigurationList = {
  encode(
    message: ServicesConfigurationList,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.nameValue) {
      Setting.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ServicesConfigurationList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServicesConfigurationList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nameValue.push(Setting.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ServicesConfigurationList {
    return {
      nameValue: Array.isArray(object?.nameValue)
        ? object.nameValue.map((e: any) => Setting.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ServicesConfigurationList): unknown {
    const obj: any = {};
    if (message.nameValue) {
      obj.nameValue = message.nameValue.map((e) =>
        e ? Setting.toJSON(e) : undefined
      );
    } else {
      obj.nameValue = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<ServicesConfigurationList>
  ): ServicesConfigurationList {
    const message = createBaseServicesConfigurationList();
    message.nameValue =
      object.nameValue?.map((e) => Setting.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTokenRelationship(): TokenRelationship {
  return {
    tokenId: undefined,
    symbol: "",
    balance: 0,
    kycStatus: 0,
    freezeStatus: 0,
    decimals: 0,
    automaticAssociation: false,
  };
}

export const TokenRelationship = {
  encode(
    message: TokenRelationship,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenId !== undefined) {
      TokenID.encode(message.tokenId, writer.uint32(10).fork()).ldelim();
    }
    if (message.symbol !== "") {
      writer.uint32(18).string(message.symbol);
    }
    if (message.balance !== 0) {
      writer.uint32(24).uint64(message.balance);
    }
    if (message.kycStatus !== 0) {
      writer.uint32(32).int32(message.kycStatus);
    }
    if (message.freezeStatus !== 0) {
      writer.uint32(40).int32(message.freezeStatus);
    }
    if (message.decimals !== 0) {
      writer.uint32(48).uint32(message.decimals);
    }
    if (message.automaticAssociation === true) {
      writer.uint32(56).bool(message.automaticAssociation);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenRelationship {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenRelationship();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenId = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.symbol = reader.string();
          break;
        case 3:
          message.balance = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.kycStatus = reader.int32() as any;
          break;
        case 5:
          message.freezeStatus = reader.int32() as any;
          break;
        case 6:
          message.decimals = reader.uint32();
          break;
        case 7:
          message.automaticAssociation = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenRelationship {
    return {
      tokenId: isSet(object.tokenId)
        ? TokenID.fromJSON(object.tokenId)
        : undefined,
      symbol: isSet(object.symbol) ? String(object.symbol) : "",
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      kycStatus: isSet(object.kycStatus)
        ? tokenKycStatusFromJSON(object.kycStatus)
        : 0,
      freezeStatus: isSet(object.freezeStatus)
        ? tokenFreezeStatusFromJSON(object.freezeStatus)
        : 0,
      decimals: isSet(object.decimals) ? Number(object.decimals) : 0,
      automaticAssociation: isSet(object.automaticAssociation)
        ? Boolean(object.automaticAssociation)
        : false,
    };
  },

  toJSON(message: TokenRelationship): unknown {
    const obj: any = {};
    message.tokenId !== undefined &&
      (obj.tokenId = message.tokenId
        ? TokenID.toJSON(message.tokenId)
        : undefined);
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.balance !== undefined &&
      (obj.balance = Math.round(message.balance));
    message.kycStatus !== undefined &&
      (obj.kycStatus = tokenKycStatusToJSON(message.kycStatus));
    message.freezeStatus !== undefined &&
      (obj.freezeStatus = tokenFreezeStatusToJSON(message.freezeStatus));
    message.decimals !== undefined &&
      (obj.decimals = Math.round(message.decimals));
    message.automaticAssociation !== undefined &&
      (obj.automaticAssociation = message.automaticAssociation);
    return obj;
  },

  fromPartial(object: DeepPartial<TokenRelationship>): TokenRelationship {
    const message = createBaseTokenRelationship();
    message.tokenId =
      object.tokenId !== undefined && object.tokenId !== null
        ? TokenID.fromPartial(object.tokenId)
        : undefined;
    message.symbol = object.symbol ?? "";
    message.balance = object.balance ?? 0;
    message.kycStatus = object.kycStatus ?? 0;
    message.freezeStatus = object.freezeStatus ?? 0;
    message.decimals = object.decimals ?? 0;
    message.automaticAssociation = object.automaticAssociation ?? false;
    return message;
  },
};

function createBaseTokenBalance(): TokenBalance {
  return { tokenId: undefined, balance: 0, decimals: 0 };
}

export const TokenBalance = {
  encode(
    message: TokenBalance,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenId !== undefined) {
      TokenID.encode(message.tokenId, writer.uint32(10).fork()).ldelim();
    }
    if (message.balance !== 0) {
      writer.uint32(16).uint64(message.balance);
    }
    if (message.decimals !== 0) {
      writer.uint32(24).uint32(message.decimals);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenBalance {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenBalance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenId = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.balance = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.decimals = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenBalance {
    return {
      tokenId: isSet(object.tokenId)
        ? TokenID.fromJSON(object.tokenId)
        : undefined,
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      decimals: isSet(object.decimals) ? Number(object.decimals) : 0,
    };
  },

  toJSON(message: TokenBalance): unknown {
    const obj: any = {};
    message.tokenId !== undefined &&
      (obj.tokenId = message.tokenId
        ? TokenID.toJSON(message.tokenId)
        : undefined);
    message.balance !== undefined &&
      (obj.balance = Math.round(message.balance));
    message.decimals !== undefined &&
      (obj.decimals = Math.round(message.decimals));
    return obj;
  },

  fromPartial(object: DeepPartial<TokenBalance>): TokenBalance {
    const message = createBaseTokenBalance();
    message.tokenId =
      object.tokenId !== undefined && object.tokenId !== null
        ? TokenID.fromPartial(object.tokenId)
        : undefined;
    message.balance = object.balance ?? 0;
    message.decimals = object.decimals ?? 0;
    return message;
  },
};

function createBaseTokenBalances(): TokenBalances {
  return { tokenBalances: [] };
}

export const TokenBalances = {
  encode(
    message: TokenBalances,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.tokenBalances) {
      TokenBalance.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenBalances {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenBalances();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenBalances.push(
            TokenBalance.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenBalances {
    return {
      tokenBalances: Array.isArray(object?.tokenBalances)
        ? object.tokenBalances.map((e: any) => TokenBalance.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TokenBalances): unknown {
    const obj: any = {};
    if (message.tokenBalances) {
      obj.tokenBalances = message.tokenBalances.map((e) =>
        e ? TokenBalance.toJSON(e) : undefined
      );
    } else {
      obj.tokenBalances = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TokenBalances>): TokenBalances {
    const message = createBaseTokenBalances();
    message.tokenBalances =
      object.tokenBalances?.map((e) => TokenBalance.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTokenAssociation(): TokenAssociation {
  return { tokenId: undefined, accountId: undefined };
}

export const TokenAssociation = {
  encode(
    message: TokenAssociation,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenId !== undefined) {
      TokenID.encode(message.tokenId, writer.uint32(10).fork()).ldelim();
    }
    if (message.accountId !== undefined) {
      AccountID.encode(message.accountId, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenAssociation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenAssociation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenId = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.accountId = AccountID.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenAssociation {
    return {
      tokenId: isSet(object.tokenId)
        ? TokenID.fromJSON(object.tokenId)
        : undefined,
      accountId: isSet(object.accountId)
        ? AccountID.fromJSON(object.accountId)
        : undefined,
    };
  },

  toJSON(message: TokenAssociation): unknown {
    const obj: any = {};
    message.tokenId !== undefined &&
      (obj.tokenId = message.tokenId
        ? TokenID.toJSON(message.tokenId)
        : undefined);
    message.accountId !== undefined &&
      (obj.accountId = message.accountId
        ? AccountID.toJSON(message.accountId)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TokenAssociation>): TokenAssociation {
    const message = createBaseTokenAssociation();
    message.tokenId =
      object.tokenId !== undefined && object.tokenId !== null
        ? TokenID.fromPartial(object.tokenId)
        : undefined;
    message.accountId =
      object.accountId !== undefined && object.accountId !== null
        ? AccountID.fromPartial(object.accountId)
        : undefined;
    return message;
  },
};

function createBaseCryptoAllowance(): CryptoAllowance {
  return { owner: undefined, spender: undefined, amount: 0 };
}

export const CryptoAllowance = {
  encode(
    message: CryptoAllowance,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.owner !== undefined) {
      AccountID.encode(message.owner, writer.uint32(10).fork()).ldelim();
    }
    if (message.spender !== undefined) {
      AccountID.encode(message.spender, writer.uint32(18).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(24).int64(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CryptoAllowance {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCryptoAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = AccountID.decode(reader, reader.uint32());
          break;
        case 2:
          message.spender = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          message.amount = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CryptoAllowance {
    return {
      owner: isSet(object.owner) ? AccountID.fromJSON(object.owner) : undefined,
      spender: isSet(object.spender)
        ? AccountID.fromJSON(object.spender)
        : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: CryptoAllowance): unknown {
    const obj: any = {};
    message.owner !== undefined &&
      (obj.owner = message.owner ? AccountID.toJSON(message.owner) : undefined);
    message.spender !== undefined &&
      (obj.spender = message.spender
        ? AccountID.toJSON(message.spender)
        : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    return obj;
  },

  fromPartial(object: DeepPartial<CryptoAllowance>): CryptoAllowance {
    const message = createBaseCryptoAllowance();
    message.owner =
      object.owner !== undefined && object.owner !== null
        ? AccountID.fromPartial(object.owner)
        : undefined;
    message.spender =
      object.spender !== undefined && object.spender !== null
        ? AccountID.fromPartial(object.spender)
        : undefined;
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseNftAllowance(): NftAllowance {
  return {
    tokenId: undefined,
    owner: undefined,
    spender: undefined,
    serialNumbers: [],
    approvedForAll: undefined,
  };
}

export const NftAllowance = {
  encode(
    message: NftAllowance,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenId !== undefined) {
      TokenID.encode(message.tokenId, writer.uint32(10).fork()).ldelim();
    }
    if (message.owner !== undefined) {
      AccountID.encode(message.owner, writer.uint32(18).fork()).ldelim();
    }
    if (message.spender !== undefined) {
      AccountID.encode(message.spender, writer.uint32(26).fork()).ldelim();
    }
    writer.uint32(34).fork();
    for (const v of message.serialNumbers) {
      writer.int64(v);
    }
    writer.ldelim();
    if (message.approvedForAll !== undefined) {
      BoolValue.encode(
        { value: message.approvedForAll! },
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NftAllowance {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNftAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenId = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.owner = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          message.spender = AccountID.decode(reader, reader.uint32());
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.serialNumbers.push(longToNumber(reader.int64() as Long));
            }
          } else {
            message.serialNumbers.push(longToNumber(reader.int64() as Long));
          }
          break;
        case 5:
          message.approvedForAll = BoolValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NftAllowance {
    return {
      tokenId: isSet(object.tokenId)
        ? TokenID.fromJSON(object.tokenId)
        : undefined,
      owner: isSet(object.owner) ? AccountID.fromJSON(object.owner) : undefined,
      spender: isSet(object.spender)
        ? AccountID.fromJSON(object.spender)
        : undefined,
      serialNumbers: Array.isArray(object?.serialNumbers)
        ? object.serialNumbers.map((e: any) => Number(e))
        : [],
      approvedForAll: isSet(object.approvedForAll)
        ? Boolean(object.approvedForAll)
        : undefined,
    };
  },

  toJSON(message: NftAllowance): unknown {
    const obj: any = {};
    message.tokenId !== undefined &&
      (obj.tokenId = message.tokenId
        ? TokenID.toJSON(message.tokenId)
        : undefined);
    message.owner !== undefined &&
      (obj.owner = message.owner ? AccountID.toJSON(message.owner) : undefined);
    message.spender !== undefined &&
      (obj.spender = message.spender
        ? AccountID.toJSON(message.spender)
        : undefined);
    if (message.serialNumbers) {
      obj.serialNumbers = message.serialNumbers.map((e) => Math.round(e));
    } else {
      obj.serialNumbers = [];
    }
    message.approvedForAll !== undefined &&
      (obj.approvedForAll = message.approvedForAll);
    return obj;
  },

  fromPartial(object: DeepPartial<NftAllowance>): NftAllowance {
    const message = createBaseNftAllowance();
    message.tokenId =
      object.tokenId !== undefined && object.tokenId !== null
        ? TokenID.fromPartial(object.tokenId)
        : undefined;
    message.owner =
      object.owner !== undefined && object.owner !== null
        ? AccountID.fromPartial(object.owner)
        : undefined;
    message.spender =
      object.spender !== undefined && object.spender !== null
        ? AccountID.fromPartial(object.spender)
        : undefined;
    message.serialNumbers = object.serialNumbers?.map((e) => e) || [];
    message.approvedForAll = object.approvedForAll ?? undefined;
    return message;
  },
};

function createBaseTokenAllowance(): TokenAllowance {
  return {
    tokenId: undefined,
    owner: undefined,
    spender: undefined,
    amount: 0,
  };
}

export const TokenAllowance = {
  encode(
    message: TokenAllowance,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenId !== undefined) {
      TokenID.encode(message.tokenId, writer.uint32(10).fork()).ldelim();
    }
    if (message.owner !== undefined) {
      AccountID.encode(message.owner, writer.uint32(18).fork()).ldelim();
    }
    if (message.spender !== undefined) {
      AccountID.encode(message.spender, writer.uint32(26).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(32).int64(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenAllowance {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenId = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.owner = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          message.spender = AccountID.decode(reader, reader.uint32());
          break;
        case 4:
          message.amount = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenAllowance {
    return {
      tokenId: isSet(object.tokenId)
        ? TokenID.fromJSON(object.tokenId)
        : undefined,
      owner: isSet(object.owner) ? AccountID.fromJSON(object.owner) : undefined,
      spender: isSet(object.spender)
        ? AccountID.fromJSON(object.spender)
        : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: TokenAllowance): unknown {
    const obj: any = {};
    message.tokenId !== undefined &&
      (obj.tokenId = message.tokenId
        ? TokenID.toJSON(message.tokenId)
        : undefined);
    message.owner !== undefined &&
      (obj.owner = message.owner ? AccountID.toJSON(message.owner) : undefined);
    message.spender !== undefined &&
      (obj.spender = message.spender
        ? AccountID.toJSON(message.spender)
        : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    return obj;
  },

  fromPartial(object: DeepPartial<TokenAllowance>): TokenAllowance {
    const message = createBaseTokenAllowance();
    message.tokenId =
      object.tokenId !== undefined && object.tokenId !== null
        ? TokenID.fromPartial(object.tokenId)
        : undefined;
    message.owner =
      object.owner !== undefined && object.owner !== null
        ? AccountID.fromPartial(object.owner)
        : undefined;
    message.spender =
      object.spender !== undefined && object.spender !== null
        ? AccountID.fromPartial(object.spender)
        : undefined;
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseGrantedCryptoAllowance(): GrantedCryptoAllowance {
  return { spender: undefined, amount: 0 };
}

export const GrantedCryptoAllowance = {
  encode(
    message: GrantedCryptoAllowance,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.spender !== undefined) {
      AccountID.encode(message.spender, writer.uint32(10).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(16).int64(message.amount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GrantedCryptoAllowance {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGrantedCryptoAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.spender = AccountID.decode(reader, reader.uint32());
          break;
        case 2:
          message.amount = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GrantedCryptoAllowance {
    return {
      spender: isSet(object.spender)
        ? AccountID.fromJSON(object.spender)
        : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: GrantedCryptoAllowance): unknown {
    const obj: any = {};
    message.spender !== undefined &&
      (obj.spender = message.spender
        ? AccountID.toJSON(message.spender)
        : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    return obj;
  },

  fromPartial(
    object: DeepPartial<GrantedCryptoAllowance>
  ): GrantedCryptoAllowance {
    const message = createBaseGrantedCryptoAllowance();
    message.spender =
      object.spender !== undefined && object.spender !== null
        ? AccountID.fromPartial(object.spender)
        : undefined;
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseGrantedNftAllowance(): GrantedNftAllowance {
  return {
    tokenId: undefined,
    spender: undefined,
    serialNumbers: [],
    approvedForAll: false,
  };
}

export const GrantedNftAllowance = {
  encode(
    message: GrantedNftAllowance,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenId !== undefined) {
      TokenID.encode(message.tokenId, writer.uint32(10).fork()).ldelim();
    }
    if (message.spender !== undefined) {
      AccountID.encode(message.spender, writer.uint32(18).fork()).ldelim();
    }
    writer.uint32(26).fork();
    for (const v of message.serialNumbers) {
      writer.int64(v);
    }
    writer.ldelim();
    if (message.approvedForAll === true) {
      writer.uint32(32).bool(message.approvedForAll);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GrantedNftAllowance {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGrantedNftAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenId = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.spender = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.serialNumbers.push(longToNumber(reader.int64() as Long));
            }
          } else {
            message.serialNumbers.push(longToNumber(reader.int64() as Long));
          }
          break;
        case 4:
          message.approvedForAll = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GrantedNftAllowance {
    return {
      tokenId: isSet(object.tokenId)
        ? TokenID.fromJSON(object.tokenId)
        : undefined,
      spender: isSet(object.spender)
        ? AccountID.fromJSON(object.spender)
        : undefined,
      serialNumbers: Array.isArray(object?.serialNumbers)
        ? object.serialNumbers.map((e: any) => Number(e))
        : [],
      approvedForAll: isSet(object.approvedForAll)
        ? Boolean(object.approvedForAll)
        : false,
    };
  },

  toJSON(message: GrantedNftAllowance): unknown {
    const obj: any = {};
    message.tokenId !== undefined &&
      (obj.tokenId = message.tokenId
        ? TokenID.toJSON(message.tokenId)
        : undefined);
    message.spender !== undefined &&
      (obj.spender = message.spender
        ? AccountID.toJSON(message.spender)
        : undefined);
    if (message.serialNumbers) {
      obj.serialNumbers = message.serialNumbers.map((e) => Math.round(e));
    } else {
      obj.serialNumbers = [];
    }
    message.approvedForAll !== undefined &&
      (obj.approvedForAll = message.approvedForAll);
    return obj;
  },

  fromPartial(object: DeepPartial<GrantedNftAllowance>): GrantedNftAllowance {
    const message = createBaseGrantedNftAllowance();
    message.tokenId =
      object.tokenId !== undefined && object.tokenId !== null
        ? TokenID.fromPartial(object.tokenId)
        : undefined;
    message.spender =
      object.spender !== undefined && object.spender !== null
        ? AccountID.fromPartial(object.spender)
        : undefined;
    message.serialNumbers = object.serialNumbers?.map((e) => e) || [];
    message.approvedForAll = object.approvedForAll ?? false;
    return message;
  },
};

function createBaseGrantedTokenAllowance(): GrantedTokenAllowance {
  return { tokenId: undefined, spender: undefined, amount: 0 };
}

export const GrantedTokenAllowance = {
  encode(
    message: GrantedTokenAllowance,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tokenId !== undefined) {
      TokenID.encode(message.tokenId, writer.uint32(10).fork()).ldelim();
    }
    if (message.spender !== undefined) {
      AccountID.encode(message.spender, writer.uint32(18).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(24).int64(message.amount);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GrantedTokenAllowance {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGrantedTokenAllowance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenId = TokenID.decode(reader, reader.uint32());
          break;
        case 2:
          message.spender = AccountID.decode(reader, reader.uint32());
          break;
        case 3:
          message.amount = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GrantedTokenAllowance {
    return {
      tokenId: isSet(object.tokenId)
        ? TokenID.fromJSON(object.tokenId)
        : undefined,
      spender: isSet(object.spender)
        ? AccountID.fromJSON(object.spender)
        : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: GrantedTokenAllowance): unknown {
    const obj: any = {};
    message.tokenId !== undefined &&
      (obj.tokenId = message.tokenId
        ? TokenID.toJSON(message.tokenId)
        : undefined);
    message.spender !== undefined &&
      (obj.spender = message.spender
        ? AccountID.toJSON(message.spender)
        : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    return obj;
  },

  fromPartial(
    object: DeepPartial<GrantedTokenAllowance>
  ): GrantedTokenAllowance {
    const message = createBaseGrantedTokenAllowance();
    message.tokenId =
      object.tokenId !== undefined && object.tokenId !== null
        ? TokenID.fromPartial(object.tokenId)
        : undefined;
    message.spender =
      object.spender !== undefined && object.spender !== null
        ? AccountID.fromPartial(object.spender)
        : undefined;
    message.amount = object.amount ?? 0;
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
