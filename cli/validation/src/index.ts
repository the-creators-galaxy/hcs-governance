import { getHcsAccountBalance, getHcsMessageByConsensusTimestamp, getHcsTokenInfo, getValidHcsMessagesInRange } from "./mirror";
import { Attestation, BallotInfo, HcsCreateProposalMessage, HcsVoteMessage, Vote } from "./types";
import { getCurrentTime, isAddress, isTimestamp } from "./util";
import * as crypto from "crypto";

export async function attest(hostname: string, ballotId: string): Promise<Attestation> {
    let ballotInfo: BallotInfo;
    const votes = new Map<string, Vote>();
    let tally: number[];
    let winner: number;
    let hashData: string;
    let hashValue: string;

    validateArguments();
    await getProposalInfo();
    await gatherVotes();
    tallyVotes();
    createHashData();
    computeHash();
    return outputResults();

    function validateArguments() {
        if (!hostname) {
            throw new Error(`Hostname is missing.`);
        }
        if (!isTimestamp(ballotId)) {
            throw new Error('Invalid ballotId');
        }
    }

    async function getProposalInfo() {
        try {
            const hcsMessage = await getHcsMessageByConsensusTimestamp(hostname, ballotId);
            const jsonMessage = Buffer.from(hcsMessage.message, 'base64');
            const createMessage = JSON.parse(jsonMessage.toString('ascii')) as HcsCreateProposalMessage;
            if (!createMessage) {
                throw new Error(`Invalid 'create-ballot' message.`);
            }
            if (`create-ballot` !== createMessage.type) {
                throw new Error(`Message is not a 'create-proposal' message.`);
            }
            if (!isAddress(createMessage.tokenId)) {
                throw new Error(`Proposal definition does not identify a valid token.`);
            }
            if (!createMessage.title) {
                throw new Error(`Proposal does not contain a title.`);
            }
            if (!createMessage.description) {
                throw new Error(`Proposal does not contain a description link.`);
            }
            if (!createMessage.discussion) {
                throw new Error(`Proposal does not contain a discussion link.`);
            }
            if (`single-choice` !== createMessage.scheme) {
                throw new Error(`This tool can only validate 'single-choice' proposal voting schemes.`);
            }
            if (!createMessage.choices || createMessage.choices.length < 2) {
                throw new Error(`Proposal needs at least two Voting Choices.`);
            }
            for (let i = 0; i < createMessage.choices.length; i++) {
                if (!createMessage.choices[i]) {
                    throw new Error(`Proposal is missing value for choice no. ${i}`);
                }
            }
            if (!isTimestamp(createMessage.startTimestamp)) {
                throw new Error(`Proposal has an Invalid Voting Start Time.`);
            }
            if (!isTimestamp(createMessage.endTimestamp)) {
                throw new Error(`Proposal has an Invalid Voting End Time.`);
            }
            if (createMessage.startTimestamp > createMessage.endTimestamp) {
                throw new Error('Proposal Voting Ending Time preceeds Starting Time.');
            }
            if (hcsMessage.consensus_timestamp > createMessage.startTimestamp) {
                throw new Error('Proposal Voting Starting Time preceeds Proposal Creation Time.');
            }
            const currentTime = getCurrentTime();
            if (currentTime < createMessage.startTimestamp) {
                throw new Error('Voting has not started for this proposal.');
            }
            if (currentTime < createMessage.endTimestamp) {
                throw new Error('Voting has not completed for this proposal.');
            }
            if (createMessage.threshold) {
                if (createMessage.threshold < 0.0 || createMessage.threshold > 1.0) {
                    throw new Error(`Proposal threshold is out of valid range of [0,1].`);
                }
            }
            if (createMessage.ineligible && createMessage.ineligible.length > 0) {
                for (let addr of createMessage.ineligible) {
                    if (!isAddress(addr)) {
                        throw new Error(`Proposal definition contains an invalid ineligible address.`);
                    }
                }
            }
            const tokenInfo = await getHcsTokenInfo(hostname, createMessage.tokenId);
            if (!tokenInfo) {
                throw new Error('Proposal Voting Token was not found.');
            }
            if (tokenInfo.deleted) {
                throw new Error('Proposal Voting Token has been deleted.');
            }
            if (hcsMessage.consensus_timestamp < tokenInfo.created_timestamp) {
                throw new Error('Proposal was created before its voting token was created.');
            }
            if ('FUNGIBLE_COMMON' !== tokenInfo.type) {
                throw new Error('Proposal does not utilize a fungible voting token.');
            }
            let threshold = 0;
            let ineligible = createMessage.ineligible || [];
            if(createMessage.threshold > 0.0) {
                if (ineligible.length > 0) {
                    let ineligibleBalances = 0;
                    for (const addr of ballotInfo.ineligible) {
                        const balanceList = await getHcsAccountBalance(hostname, addr, ballotInfo.startVoting);
                        if (balanceList &&
                            balanceList.balances &&
                            balanceList.balances.length === 1) {
                            const balances = balanceList.balances[0];
                            if (balances &&
                                addr === balances.account &&
                                balances.tokens) {
                                const tokenBalance = balances.tokens.find(b => ballotInfo.tokenId === b.token_id);
                                if (tokenBalance &&
                                    tokenBalance.balance > 0) {
                                    ineligibleBalances = ineligibleBalances + tokenBalance.balance;
                                }
                            }
                        }
                    }
                    threshold = Math.round(createMessage.threshold * (tokenInfo.circulation - ineligibleBalances));
                } else {
                    threshold = Math.round(createMessage.threshold * tokenInfo.circulation);
                }    
            }
            ballotInfo =
            {
                ballotId,
                tokenId: createMessage.tokenId,
                topicId: hcsMessage.topic_id,
                choices: createMessage.choices,
                startVoting: createMessage.startTimestamp,
                endVoting: createMessage.endTimestamp,
                threshold,
                ineligible
            };
        }
        catch (err) {
            throw new Error(`Invalid Proposal with ID ${ballotId}: ${err}`);
        }
    }
    async function gatherVotes() {
        for await (const hcsMessage of getValidHcsMessagesInRange(hostname, ballotInfo.topicId, ballotInfo.startVoting, ballotInfo.endVoting)) {
            const jsonMessage = Buffer.from(hcsMessage.message, 'base64');
            const voteMessage = JSON.parse(jsonMessage.toString('ascii')) as HcsVoteMessage;
            if (voteMessage &&
                'cast-vote' === voteMessage.type &&
                ballotId === voteMessage.ballotId &&
                ballotInfo.startVoting <= hcsMessage.consensus_timestamp &&
                ballotInfo.endVoting >= hcsMessage.consensus_timestamp &&
                voteMessage.vote >= -1 &&
                voteMessage.vote < ballotInfo.choices.length &&
                ballotInfo.ineligible.findIndex(addr => addr === hcsMessage.payer_account_id) === -1) {
                const balanceList = await getHcsAccountBalance(hostname, hcsMessage.payer_account_id, ballotInfo.startVoting);
                if (balanceList &&
                    ballotInfo.startVoting >= balanceList.timestamp &&
                    balanceList.balances &&
                    balanceList.balances.length === 1) {
                    const balances = balanceList.balances[0];
                    if (balances &&
                        hcsMessage.payer_account_id === balances.account &&
                        balances.tokens) {
                        const tokenBalance = balances.tokens.find(b => ballotInfo.tokenId === b.token_id);
                        if (tokenBalance &&
                            tokenBalance.balance > 0) {
                            votes.set(hcsMessage.payer_account_id, {
                                choice: voteMessage.vote,
                                balance: tokenBalance.balance
                            });
                        }
                    }
                }
            }
        }
    }

    function tallyVotes() {
        tally = Array<number>(ballotInfo.choices.length).fill(0);
        for (const vote of votes.values()) {
            tally[vote.choice] = tally[vote.choice] + vote.balance;
        }
        winner = 0;
        for (let i = 1; i < tally.length; i++) {
            if (tally[i] > tally[winner]) {
                winner = i;
            }
        }
        // Double Check for Ties
        if (tally.filter(t => t == tally[winner]).length > 1) {
            winner = -1;
        }
    }

    function createHashData() {
        var data: string[] = [];
        data.push(ballotInfo.ballotId);
        data.push(`${ballotInfo.threshold}`);
        const keys = [...votes.keys()].sort();
        for (const account of keys) {
            const vote = votes.get(account);
            data.push(`${account}-${vote?.choice}-${vote?.balance}`);
        }
        for (let i = 0; i < tally.length; i++) {
            data.push(`${i}.${tally[i]}`);
        }
        if (winner > -1) {
            data.push(`${winner}:${ballotInfo.choices[winner]}`);
        } else {
            data.push('-1');
        }
        hashData = data.join('|');
    }
    function computeHash() {
        hashValue = crypto.createHash('md5').update(hashData, 'ascii').digest('hex');
    }
    function outputResults(): Attestation {
        return {
            type: 'attest-results',
            ballotId,
            tally,
            result: winner,
            hash: hashValue,
        };
    }
}