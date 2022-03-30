/**
 * Enumerates the user interface cases for the state of a proposal.
 */
export enum ProposalStatus {
  /**
   * Valid ballot, but voting has not started.
   */
  Queued,
  /**
   * Ballot where voting has started, but not yet complete.
   */
  Voting,
  /**
   * Ballot where voting has completed and checksums can be computed.
   */
  Closed,
}
