export interface HcsLink
{
    next: string;
}

export interface TokenBalance
{
    token_id: string;
    balance: number;
}

export interface HcsAccountBalance
{
    account: string;
    balance: number;
    tokens: TokenBalance[];
}

export interface HcsAccountBalanceList
{
    timestamp: string;
    balances: HcsAccountBalance[];
    links: HcsLink;
}

export interface HcsTokenInfo
{
    created_timestamp: string;
    type: string;
    deleted: boolean;
    circulation: number;
}

export interface HcsChunkInfo
{
    initial_transaction_id: string;
    nonce: number;
    number: number;
    total: number;
    scheduled: boolean;
}

export interface HcsMessage
{
    chunk_info: HcsChunkInfo;
    consensus_timestamp: string;
    message: string;
    payer_account_id: string;
    running_hash: string;
    running_hash_version: number;
    sequence_number: number;
    topic_id: string;
}

export interface HcsMessageList
{
    links: HcsLink;
    messages: HcsMessage[];
}

export interface HcsVoteMessage
{
    type: string;
    ballotId: string;
    vote: number;
}

export interface HcsCreateProposalMessage
{
    type: string;
    tokenId: string;
    title: string;
    description: string;
    discussion: string;
    scheme: string;
    choices: string[];
    startTimestamp: string;
    endTimestamp: string;
    threshold: number,
    ineligible: string[]
}

export interface Attestation
{
    type: string;
    ballotId: string;
    tally: number[];
    result: number;
    hash: string;
}

export interface Vote
{
    choice: number;
    balance: number;
}

export interface BallotInfo
{
    ballotId: string;
    topicId: string;
    tokenId: string;
    choices: string[];
    startVoting: string;
    endVoting: string;
    threshold: number;
    ineligible: string[];
}