import { ProposalStatus } from "@/models/proposal-status";
import { dateFromEpoch } from "@/models/epoch";
import type { EntityIdKeyString } from "@bugbytes/hapi-util";
/**
 * Interface holding proposal information to display.
 */
export interface Proposal {
  /**
   * Identifier of the proposal (timestamp when it was created).
   */
  consensusTimestamp: string;
  /**
   * Hedera account authoring the proposal, in 0.0.123 string format.
   */
  author: string;
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
   * An array of choices that may be cast.  At this time the first is
   * 'Yes' (index 0) and the second is 'No' (index 1).  The system will
   * treat the first in the list as the affirmative vote and all others
   * as negative votes.
   */
  choices: string[];
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
  /**
   * For queued or open proposals, the number of days before voting closes.
   */
  expires: number;
  /**
   * Current UI status of the proposal.
   */
  status: ProposalStatus;
}
/**
 * Retrieves the full list of proposals from the remote server.
 */
export async function getProposals(): Promise<Proposal[]> {
  const now = new Date();
  const url = `${import.meta.env.VITE_API_ROOT}/api/v1/ballots`;
  const response = await fetch(url);
  const json = await response.json();
  return json.map((item: any) => {
    const { status, expires } = computeStatus(now, item);
    return {
      consensusTimestamp: item.consensusTimestamp,
      author: item.payerId,
      title: item.title,
      description: item.description,
      choices: item.choices,
      tally: item.tally,
      winner: item.winner,
      checksum: item.checksum,
      status,
      expires,
    };
  });
}
/**
 * Represents a single vote.
 */
export interface Vote {
  consensusTimestamp: string;
  payerId: string;
  vote: number;
  tokenBalance: number;
}

export interface ProposalDetail {
  consensusTimestamp: string;
  author: string;
  title: string;
  description: string;
  discussion: string;
  scheme: string;
  choices: string[];
  expires: number;
  status: ProposalStatus;
  threshold: number;
  ineligible: EntityIdKeyString[];
  startTimestamp: string;
  endTimestamp: string;
  tally: number[];
  votes: Vote[];
  winner: number;
  checksum: string;
}

export async function getProposalDetails(
  id: string
): Promise<ProposalDetail | null> {
  const now = new Date();
  const url = `${
    import.meta.env.VITE_API_ROOT
  }/api/v1/ballots/${encodeURIComponent(id)}`;
  const response = await fetch(url);
  if (response.status === 404) {
    return null;
  }
  const json = await response.json();
  const { status, expires } = computeStatus(now, json);
  return {
    consensusTimestamp: json.consensusTimestamp,
    author: json.payerId,
    title: json.title,
    description: json.description,
    discussion: json.discussion,
    scheme: json.scheme,
    choices: json.choices,
    startTimestamp: json.startTimestamp,
    endTimestamp: json.endTimestamp,
    threshold: json.minVotingThreshold,
    ineligible: json.ineligibleAccounts,
    tally: json.tally,
    votes: json.votes,
    winner: json.winner,
    checksum: json.checksum,
    status,
    expires,
  };
}

function computeStatus(
  now: Date,
  proposal: any
): { status: ProposalStatus; expires: number } {
  const startTime = dateFromEpoch(proposal.startTimestamp);
  const endTime = dateFromEpoch(proposal.endTimestamp);
  const status =
    now < startTime
      ? ProposalStatus.Queued
      : now > endTime
      ? ProposalStatus.Closed
      : ProposalStatus.Voting;
  const expires =
    status === ProposalStatus.Voting
      ? Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  return { status, expires };
}
