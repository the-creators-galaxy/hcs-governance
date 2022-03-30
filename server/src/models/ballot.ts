/**
 * Stores the details of a proposal ballot (excluding individual votes cast).
 */
export interface Ballot {
	/**
	 * The consensus timestamp of the HCS message creating the proposal ballot.
	 * This becomes the proposal ballot’s identifier.
	 */
	consensusTimestamp: string;
	/**
	 * The voting token associated with this proposal, in 0.0.123 string format.
	 */
	tokenId: string;
	/**
	 * The hedera account that submitted the ballot creation message,
	 * in 0.0.123 string format.
	 */
	payerId: string;
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
	 * The date and time voting for this proposal may commence,
	 * in hedera 0000.0000 epoch string format.
	 */
	startTimestamp: string;
	/**
	 * The date and time voting for this proposal ceases,
	 * in hedera 0000.0000 epoch string format.
	 */
	endTimestamp: string;
	/**
	 * The tally of votes (by voting token balance weight)
	 * which may be computed after the voting window has closed.
	 * The indexes of the votes match the indexes of the choices array.
	 */
	tally: number[];
	/**
	 * If computable, the index of the winning choice, if not yet
	 * computable, or a tie has resulted, the value will be -1.
	 */
	winner: number;
	/**
	 * The checksum computed from voting tabulation process, should
	 * match the checksum generated from independently available ballot
	 * counting command line applications.
	 */
	checksum: string;
}
