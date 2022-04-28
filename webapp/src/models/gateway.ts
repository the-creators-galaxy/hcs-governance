import { ref } from "vue";
/**
 * Enumeration of the supported Wallet/Gateway options for sending HCS messages.
 */
export enum GatewayProvider {
  /**
   * None Selected
   */
  None,
  /**
   * Manual Copy and paste of HCS Payload into another system
   */
  CopyAndPaste,
  /**
   * Hash Connect Protocol.
   */
  HashConnect,
}
/**
 * Holds the information necessary to generate a create-ballot message.
 */
export interface BallotCreateParams {
  /**
   * The title of the proposal.
   */
  title: string;
  /**
   * A url (typ. IPFS) to a document describing the details of the proposal.
   */
  description: string;
  /**
   * A Url to the public discussion link for the proposal.
   */
  discussion: string;
  /**
   * The identifier of the voting scheme to use, at this time only
   * 'single-choice' is supported.
   */
  scheme: string;
  /**
   * An array of choices that may be cast.  At this time the first is
   * 'Yes' (index 0) and the second is 'No' (index 1).  The system will
   * treat the first in the list as the affirmative vote and all others
   * as negative votes.
   */
  choices: string[];
  /**
   * The date voting for this proposal may commence.
   */
  startDate: Date;
  /**
   * The date voting for this proposal ceases.
   */
  endDate: Date;
}

export interface CastVoteParams {
  ballotId: string;
  vote: number;
}

export const currentGateway = ref<GatewayProvider>(GatewayProvider.None);
