import { getFirstHcsMessageInTopic, getHcsAccountBalance, getHcsMessageByConsensusTimestamp, getHcsTokenInfo, getValidHcsMessagesInRange } from "./mirror";
import { Attestation, BallotInfo, HcsCreateProposalMessage, HcsMessage, HcsVoteMessage, RulesDefinition, Vote } from "./types";
import { computeDiffInDays, getCurrentTime, isAddress, isAddressArrayOrUndefined, isFractionOrUndefined, isNonNegativeOrUndefined, isTimestamp } from "./util";
import * as crypto from "node:crypto";

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
            const hcsCreateMessage = await getHcsMessageByConsensusTimestamp(hostname, ballotId);
            const jsonCreateMessage = Buffer.from(hcsCreateMessage.message, 'base64');
            const createMessage = JSON.parse(jsonCreateMessage.toString('ascii')) as HcsCreateProposalMessage;
            if (!createMessage) {
                throw new Error(`Invalid 'create-ballot' message.`);
            }
            if (`create-ballot` !== createMessage.type) {
                throw new Error(`Message is not a 'create-ballot' message.`);
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
                console.log(createMessage.startTimestamp);
                throw new Error(`Proposal has an Invalid Voting Start Time.`);
            }
            if (!isTimestamp(createMessage.endTimestamp)) {
                throw new Error(`Proposal has an Invalid Voting End Time.`);
            }
            if (createMessage.startTimestamp > createMessage.endTimestamp) {
                throw new Error('Proposal Voting Ending Time preceeds Starting Time.');
            }
            if (hcsCreateMessage.consensus_timestamp > createMessage.startTimestamp) {
                throw new Error('Proposal Voting Starting Time preceeds Proposal Creation Time.');
            }
            if (!isAddressArrayOrUndefined(createMessage.ineligible)) {
                throw new Error(`Proposal definition contains an invalid array for the ineligible list of addresses.`);
            }
            if (!isFractionOrUndefined(createMessage.threshold)) {
                throw new Error(`Proposal threshold is out of valid range of [0,1].`);
            }
            const hcsRulesMessage = await getFirstHcsMessageInTopic(hostname, hcsCreateMessage.topic_id);
            const jsonRulesMessage = Buffer.from(hcsRulesMessage.message, 'base64');
            const rulesDefinition = JSON.parse(jsonRulesMessage.toString('ascii')) as RulesDefinition;
            if (`define-rules` !== rulesDefinition.type) {
                throw new Error(`The first message in the HCS Voting Stream ${hcsRulesMessage.topic_id} does not define the rules.`);
            }
            if (!isAddressArrayOrUndefined(rulesDefinition.ineligibleAccounts)) {
                throw new Error(`The HCS Voting Stream rules contain an invalid array of ineligible addresses.`);
            }
            if (!isAddressArrayOrUndefined(rulesDefinition.ballotCreators)) {
                throw new Error(`The HCS Voting Stream rules contain an invalid array of ballot creator addresses.`);
            }
            if (!isFractionOrUndefined(rulesDefinition.minVotingThreshold)) {
                throw new Error(`The HCS Voting Stream rules contain an invalid value for voting threshold.`);
            }
            if (!isNonNegativeOrUndefined(rulesDefinition.minimumVotingPeriod)) {
                throw new Error(`The HCS Voting Stream rules contain an invalid value for minimum voting period.`);
            }
            if (!isNonNegativeOrUndefined(rulesDefinition.minimumStandoffPeriod)) {
                throw new Error(`The HCS Voting Stream rules contain an invalid value for minimum voting starting standoff period.`);
            }
            if (createMessage.tokenId !== rulesDefinition.tokenId) {
                throw new Error(`Voting Token ID for ballot Ballot does not match HCS Voting stream rules.`);
            }
            if (rulesDefinition.ballotCreators && !rulesDefinition.ballotCreators.includes(hcsCreateMessage.payer_account_id)) {
                throw new Error(`Ballot creator is not on the HCS Voting Stream ballot creator allowed list.`);
            }
            if (rulesDefinition.minimumVotingPeriod !== undefined && computeDiffInDays(createMessage.startTimestamp, createMessage.endTimestamp) < rulesDefinition.minimumVotingPeriod) {
                throw new Error(`Ballot voting period is shorter than what is allowed in the HCS Voting Stream rules.`);
            }
            if (rulesDefinition.minimumStandoffPeriod !== undefined && computeDiffInDays(hcsCreateMessage.consensus_timestamp, createMessage.startTimestamp) < rulesDefinition.minimumStandoffPeriod) {
                throw new Error(`Ballot voting period starts too soon from ballot creation than what is allowed in the HCS Voting Stream rules.`);
            }
            if (rulesDefinition.minVotingThreshold !== undefined && createMessage.threshold !== undefined && createMessage.threshold < rulesDefinition.minVotingThreshold) {
                throw new Error(`Ballot required voting threshold is smaller than what is allowed in the HCS Voting Stream rules.`);
            }
            const currentTime = getCurrentTime();
            if (currentTime < createMessage.startTimestamp) {
                throw new Error('Voting has not started for this proposal.');
            }
            if (currentTime < createMessage.endTimestamp) {
                throw new Error('Voting has not completed for this proposal.');
            }
            const tokenInfo = await getHcsTokenInfo(hostname, createMessage.tokenId);
            if (!tokenInfo) {
                throw new Error('Proposal Voting Token was not found.');
            }
            if (tokenInfo.deleted) {
                throw new Error('Proposal Voting Token has been deleted.');
            }
            if (hcsCreateMessage.consensus_timestamp < tokenInfo.created_timestamp) {
                throw new Error('Proposal was created before its voting token was created.');
            }
            if ('FUNGIBLE_COMMON' !== tokenInfo.type) {
                throw new Error('Proposal does not utilize a fungible voting token.');
            }
            let threshold = 0;
            let requiredThresholdFraction = createMessage.threshold || rulesDefinition.minVotingThreshold || 0;
            let ineligible = [...new Set([...(createMessage.ineligible || []), ...(rulesDefinition.ineligibleAccounts || [])])]
            if (requiredThresholdFraction > 0.0) {
                const circulation = parseInt(tokenInfo.total_supply, 10);
                if (ineligible.length > 0) {
                    let ineligibleBalances = 0;
                    for (const addr of ineligible) {
                        const balanceList = await getHcsAccountBalance(hostname, addr, createMessage.startTimestamp);
                        if (balanceList &&
                            balanceList.balances &&
                            balanceList.balances.length === 1) {
                            const balances = balanceList.balances[0];
                            if (balances &&
                                addr === balances.account &&
                                balances.tokens) {
                                const tokenBalance = balances.tokens.find(b => createMessage.tokenId === b.token_id);
                                if (tokenBalance &&
                                    tokenBalance.balance > 0) {
                                    ineligibleBalances = ineligibleBalances + tokenBalance.balance;
                                }
                            }
                        }
                    }
                    threshold = Math.ceil(requiredThresholdFraction * (circulation - ineligibleBalances));
                } else {
                    threshold = Math.ceil(requiredThresholdFraction * circulation);
                }
            }
            ballotInfo =
            {
                ballotId,
                tokenId: createMessage.tokenId,
                topicId: hcsCreateMessage.topic_id,
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
            const voteMessage = parseVoteHcsMessage(hcsMessage);
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

    function parseVoteHcsMessage(hcsMessage: HcsMessage): HcsVoteMessage | null {
        try {
            const jsonMessage = Buffer.from(hcsMessage.message, 'base64');
            return JSON.parse(jsonMessage.toString('ascii')) as HcsVoteMessage;
        } catch (error) {
            // invalid message
        }
        return null;
    }

    function tallyVotes() {
        winner = 0;
        tally = Array<number>(ballotInfo.choices.length).fill(0);
        for (const vote of votes.values()) {
            tally[vote.choice] = tally[vote.choice] + vote.balance;
        }
        const tot = tally.reduce((a, b) => a + b, 0);
        if (tot < ballotInfo.threshold) {
            // voting balance threshold was not met.
            winner = -2;
        } else {
            // If more than 2 choices, assume last is Abstain
            const list = tally.length > 2 ? tally.slice(0, tally.length - 1) : tally;
            for (let i = 1; i < list.length; i++) {
                if (list[i] > list[winner]) {
                    winner = i;
                }
            }
            // Double Check for Ties
            if (list.filter(t => t == list[winner]).length > 1) {
                winner = -1;
            }
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
            data.push(`${winner}`);
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