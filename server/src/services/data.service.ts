import { Injectable } from '@nestjs/common';
import { Ballot } from 'src/models/ballot';
import { Vote } from 'src/models/vote';
import { epochFromDate } from 'src/util/epoch';
import * as crypto from 'crypto';
/**
 * Internal tracking of the last HCS timestamp processed,
 * this is necessary to track when voting windows should
 * be closed and subsequently have the results tallied and
 * checksums created.
 */
let lastUpdated = '0.0';
/**
 * Internal tracking of the latest HCS timestamp when the
 * balance of proposals were scanned to check for the closure
 * of voting windows.  A process is invoked periodically to
 * check if it is necessary to perform this process, depends
 * on the `lastUpdated` timestamp.
 */
let lastChecksum = '0.0';
/**
 * A handle to a timer scheduling a vote tally/checksum processing
 * run, if null, there is no future process scheduled.  This
 * periodically gets updated depending on what messages are received
 * and processed by the system.
 */
let scheduledCheck = null;
/**
 * Internal map of all the proposal ballots known for this HCS topic and
 * voting token.  The key to the map is the consensus timestamp of the
 * ballot’s creation message.
 */
const ballots = new Map<string, Ballot>();
/**
 * Internal map of all the votes fore each ballot for this HCS topic and
 * voting token.  The key to the map is the consensus timestamp of each
 * ballot’s creation message.
 */
const votes = new Map<string, Map<string, Vote>>();
/**
 * The central data storage service holding the proposal ballots and their
 * votes.  The state it holds is built up over time by processing HCS
 * messages sequentially from the start.  Presently the implementation
 * is in-memory, but could easily utilize a document database such as
 * MongoDB if the scale of data to be stored and processed necessitates
 * such an upgrade.
 */
@Injectable()
export class DataService {
	/**
	 * Gets the date and time of the last HCS message processed by this
	 * service (typically in the form of recording ballots and votes) or
	 * the date and time of the latest heartbeat check to the mirror node
	 * assuming the HCS message pipeline has completed replay and is
	 * up-to-date temporally with the ledger.
	 *
	 * @returns The value of the latest processing time stamp in hedera
	 * 0000.0000 epoch string format.
	 */
	getLastUpdated(): string {
		return lastUpdated;
	}
	/**
	 * Marks the date and time of the latest HCS message processed by this
	 * service.  Updating this value can trigger checks for ballot voting
	 * closure windows and re-calculation of vote tallies.
	 *
	 * @param timestamp The value of the time stamp in hedera 0000.0000
	 * epoch string format.
	 */
	setLastUpdated(timestamp: string) {
		if (timestamp > lastUpdated) {
			lastUpdated = timestamp;
			if (!scheduledCheck) {
				scheduledCheck = setTimeout(() => ensureChecksums(), 1000);
			}
		}
	}
	/**
	 * Retrieves the ballot information for the given consensus timestamp (id).
	 *
	 * @param consensusTimestamp The timestamp identifier of the ballot to retrieve.
	 *
	 * @returns Proposal ballot information for the given id, or undefined if not found.
	 */
	getBallot(consensusTimestamp: string): Ballot | undefined {
		ensureChecksums();
		return ballots.get(consensusTimestamp);
	}
	/**
	 * Adds a new ballot to the map of ballots.
	 *
	 * @param ballot the proposal ballot to add.
	 */
	setBallot(ballot: Ballot) {
		ballots.set(ballot.consensusTimestamp, ballot);
	}
	/**
	 * Retrieves the full list of proposal ballots tracked
	 * by the system.
	 *
	 * @returns An array listing the ballots in reverse ending
	 * voting date order, grouped by open ballots first, followed
	 * by ballots not yet opened for voting following by ballots
	 * that have been closed and their votes have been tallied.
	 */
	getBallots(): Ballot[] {
		ensureChecksums();
		const now = epochFromDate(new Date());
		return Array.from(ballots.values()).sort((a, b) => {
			const aVoting = a.startTimestamp <= now && now <= a.endTimestamp;
			const bVoting = b.startTimestamp <= now && now <= b.endTimestamp;
			if (aVoting && !bVoting) {
				return -1;
			} else if (!aVoting && bVoting) {
				return 1;
			}
			return b.endTimestamp.localeCompare(a.endTimestamp);
		});
	}
	/**
	 * Adds an individual vote to the list of votes for a proposal ballot.
	 *
	 * @param ballotId The identifier (consensus timestamp) of the proposal ballot.
	 *
	 * @param vote The vote details, including voting account, choice and voting
	 * token balance.
	 */
	addVote(ballotId: string, vote: Vote) {
		const ballot = this.getBallot(ballotId);
		if (ballot) {
			let ballotVotes = votes.get(ballot.consensusTimestamp);
			if (!ballotVotes) {
				ballotVotes = new Map<string, Vote>();
				votes.set(ballot.consensusTimestamp, ballotVotes);
			}
			ballotVotes.set(vote.payerId, vote);
			const tally = new Array(ballot.choices.length).fill(0);
			for (const v of ballotVotes.values()) {
				tally[v.vote] += v.tokenBalance;
			}
			ballot.tally = tally;
			ballot.checksum = undefined;
		}
	}
	/**
	 * Retrieves the list of (valid) votes for a given proposal ballot.
	 *
	 * @param ballotId The identifier (consensus timestamp) of the
	 * proposal ballot to retrieve.
	 *
	 * @returns An array of votes for the associated ballot, in descending
	 * order of voting token balance.
	 */
	getVotes(ballotId: string): Vote[] {
		ensureChecksums();
		const ballotVotes = votes.get(ballotId);
		const result = ballotVotes ? Array.from(ballotVotes.values()) : [];
		result.sort((a, b) => b.tokenBalance - a.tokenBalance);
		return result;
	}
}
/**
 * Private function that that reviews the state of non-closed ballots
 * checking to see if any ballots are ready for vote tallying and
 * checksum creation.  Can be invoked via different mechanisms,
 * typically polled when not actively processing but may be invoked
 * just prior to retrieving ballot lists or a particular ballot detail.
 */
function ensureChecksums() {
	if (scheduledCheck) {
		clearTimeout(scheduledCheck);
		scheduledCheck = null;
	}
	if (lastChecksum < lastUpdated) {
		for (const ballot of ballots.values()) {
			computeChecksumIfNecessary(ballot);
		}
		lastChecksum = lastUpdated;
	}
}
/**
 * Private helper function that examines a single ballot to see if
 * votes should be tallied for this ballot, performing the calculation of necessary.
 *
 * @param ballot the proposal ballot to exaxmine.  May be mutated by this function.
 */
function computeChecksumIfNecessary(ballot: Ballot) {
	if (!ballot || ballot.checksum || lastUpdated < ballot.endTimestamp) {
		return;
	}
	const voteMap = votes.get(ballot.consensusTimestamp);
	const voteList = voteMap ? Array.from(voteMap.values()) : [];
	voteList.sort((a, b) => a.payerId.localeCompare(b.payerId));
	const winner = computeWinner(ballot.tally);
	const data: string[] = [];
	data.push(ballot.consensusTimestamp);
	for (const vote of voteList) {
		data.push(`${vote.payerId}-${vote.vote}-${vote.tokenBalance}`);
	}
	for (let i = 0; i < ballot.tally.length; i++) {
		data.push(`${i}.${ballot.tally[i]}`);
	}
	if (winner > -1) {
		data.push(`${winner}:${ballot.choices[winner]}`);
	} else {
		data.push('-1');
	}
	ballot.winner = winner;
	ballot.checksum = crypto.createHash('md5').update(data.join('|'), 'ascii').digest('hex');
}
/**
 * Private helper function that computes the winning vote choice based on
 * pre-computed voting totals.
 *
 * @param tally An array of pre-computed values of the sums of the votes for
 * each proposal ballot choice.
 *
 * @returns The index of the choice with the most votes, or -1 if there
 * is no winning vote (a tie).
 */
function computeWinner(tally: number[]) {
	let winner = 0;
	for (let i = 1; i < tally.length; i++) {
		if (tally[i] > tally[winner]) {
			winner = i;
		}
	}
	// Double Check for Ties
	if (tally.filter((t) => t == tally[winner]).length > 1) {
		winner = -1;
	}
	return winner;
}
