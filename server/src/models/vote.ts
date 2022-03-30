/**
 * Stores the details of a single proposal vote by a token holder.
 */
export interface Vote {
	/**
	 * The date and time this vote was cast,
	 * in hedera 0000.0000 epoch string format.
	 */
	consensusTimestamp: string;
	/**
	 * The hedera account that cast the vote,
	 * in 0.0.123 string format.
	 */
	payerId: string;
	/**
	 * The vote choice, matches an index from the
	 * proposals choice array.
	 */
	vote: number;
	/**
	 * The voter’s associated voting token balance at the time
	 * when the voting window started (ballot’s voting start time),
	 * used to weight the vote among other votes. Enumerated in the
	 * smallest token unit.
	 */
	tokenBalance: number;
}
/**
 * Array of votes associated with a proposal.
 */
export interface Votes {
	/**
	 * Array of votes associated with a proposal.
	 */
	votes: Vote[];
}
