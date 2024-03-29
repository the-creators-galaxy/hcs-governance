﻿#nullable disable
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

long NanosPerTick = 1_000_000_000L / TimeSpan.TicksPerSecond;
HttpClient client = new HttpClient();
string mirrorNodeUrl = null;
string proposalId = null;
ProposalInfo proposalInfo = null;
Dictionary<string, Vote> votes = new Dictionary<string, Vote>();
ulong[] tally = null;
int winner = -1;
string hashData = null;
string hashValue = null;

try
{
    parseCommandLineArguments();
    await GetProposalInfo();
    await GatherVotes();
    TallyVotes();
    CreateHashData();
    ComputeHash();
    OutputResults();
    Environment.Exit(0);
}
catch (Exception fatalException)
{
    Console.Error.WriteLine(fatalException.Message);
    Environment.Exit(1);
}

void parseCommandLineArguments()
{
    if (args.Length != 2)
    {
        throw new Exception("Usage: cgip-attest <https://mirror.node.url> <proposal id>");
    }
    try
    {
        mirrorNodeUrl = new Uri(args[0]).ToString().TrimEnd('/');
    }
    catch (Exception ex)
    {
        throw new Exception($"Invalid Mirror Node URI: {ex.Message}");
    }
    if (IsTimestamp(args[1]))
    {
        proposalId = args[1];
    }
    else
    {
        throw new Exception($"Invalid Proposal ID");
    }
}

async Task GetProposalInfo()
{
    try
    {
        var hcsCreateMessage = await GetHcsMessageByConsensusTimestamp(proposalId);
        var jsonCreateMessage = Convert.FromBase64String(hcsCreateMessage.Message);
        var createMessage = JsonSerializer.Deserialize<HcsCreateProposalMessage>(jsonCreateMessage);
        if (createMessage is null)
        {
            throw new Exception("Invalid 'create-ballot' message.");
        }
        if (!"create-ballot".Equals(createMessage.MessageType))
        {
            throw new Exception("Message is not a 'create-proposal' message.");
        }
        if (!IsAddress(createMessage.TokenId))
        {
            throw new Exception("Proposal definition does not identify a valid token.");
        }
        if (string.IsNullOrWhiteSpace(createMessage.Title))
        {
            throw new Exception("Proposal does not contain a title.");
        }
        if (string.IsNullOrWhiteSpace(createMessage.Description))
        {
            throw new Exception("Proposal does not contain a description link.");
        }
        if (string.IsNullOrWhiteSpace(createMessage.Discussion))
        {
            throw new Exception("Proposal does not contain a discussion link.");
        }
        if (!"single-choice".Equals(createMessage.Scheme))
        {
            throw new Exception("This tool can only validate 'single-choice' proposal voting schemes.");
        }
        if (createMessage.Choices is null || createMessage.Choices.Length < 2)
        {
            throw new Exception("Proposal needs at least two Voting Choices.");
        }
        for (var i = 0; i < createMessage.Choices.Length; i++)
        {
            if (string.IsNullOrWhiteSpace(createMessage.Choices[i]))
            {
                throw new Exception($"Proposal is missing value for choice no. {i}");
            }
        }
        if (!IsTimestamp(createMessage.StartTimestamp))
        {
            throw new Exception("Proposal has an Invalid Voting Start Time.");
        }
        if (!IsTimestamp(createMessage.EndTimestamp))
        {
            throw new Exception("Proposal has an Invalid Voting End Time.");
        }
        if (createMessage.StartTimestamp.CompareTo(createMessage.EndTimestamp) >= 0)
        {
            throw new Exception("Proposal Voting Ending Time preceeds Starting Time.");
        }
        if (hcsCreateMessage.ConsensusTimestamp.CompareTo(createMessage.StartTimestamp) >= 0)
        {
            throw new Exception("Proposal Voting Starting Time preceeds Proposal Creation Time.");
        }
        if (!IsAddressArrayOrUndefined(createMessage.IneligibleAccounts))
        {
            throw new Exception("Proposal definition contains an invalid array for the ineligible list of addresses.");
        }
        if (!IsFractionOrUndefined(createMessage.RequiredThreshold))
        {
            throw new Exception("Proposal threshold is out of valid range of [0,1].");
        }
        var hcsRulesMessage = await GetFirstHcsMessageInTopic(hcsCreateMessage.TopicId);
        var jsonRulesMessage = Convert.FromBase64String(hcsRulesMessage.Message);
        var rulesDefinition = JsonSerializer.Deserialize<HcsRulesMessage>(jsonRulesMessage);
        if (rulesDefinition is null)
        {
            throw new Exception($"The first message in the HCS Voting Stream ${hcsRulesMessage.TopicId} does not define the rules.");
        }
        if (!"define-rules".Equals(rulesDefinition.MessageType))
        {
            throw new Exception($"The first message in the HCS Voting Stream ${hcsRulesMessage.TopicId} does not define the rules.");
        }
        if (!IsAddressArrayOrUndefined(rulesDefinition.IneligibleAccounts))
        {
            throw new Exception("The HCS Voting Stream rules contain an invalid array of ineligible addresses.");
        }
        if (!IsAddressArrayOrUndefined(rulesDefinition.BallotCreators))
        {
            throw new Exception("The HCS Voting Stream rules contain an invalid array of ballot creator addresses.");
        }
        if (!IsFractionOrUndefined(rulesDefinition.MinimumRequiredVotingThreshold))
        {
            throw new Exception("The HCS Voting Stream rules contain an invalid value for voting threshold.");
        }
        if (!IsNonNegativeOrUndefined(rulesDefinition.MinimumVotingPeriod))
        {
            throw new Exception("The HCS Voting Stream rules contain an invalid value for minimum voting period.");
        }
        if (!IsNonNegativeOrUndefined(rulesDefinition.MinimumStandoffPeriod))
        {
            throw new Exception("The HCS Voting Stream rules contain an invalid value for minimum voting starting standoff period.");
        }
        if (createMessage.TokenId != rulesDefinition.TokenId)
        {
            throw new Exception("Voting Token ID for ballot Ballot does not match HCS Voting stream rules.");
        }
        if (rulesDefinition.BallotCreators?.Length > 0 && !rulesDefinition.BallotCreators.Contains(hcsCreateMessage.PayerId))
        {
            throw new Exception("Ballot creator is not on the HCS Voting Stream ballot creator allowed list.");
        }
        if (rulesDefinition.MinimumVotingPeriod.GetValueOrDefault() > 0 && ComputeDiffInDays(createMessage.StartTimestamp, createMessage.EndTimestamp) < rulesDefinition.MinimumVotingPeriod.Value)
        {
            throw new Exception("Ballot voting period is shorter than what is allowed in the HCS Voting Stream rules.");
        }
        if (rulesDefinition.MinimumStandoffPeriod.GetValueOrDefault() > 0 && ComputeDiffInDays(hcsCreateMessage.ConsensusTimestamp, createMessage.StartTimestamp) < rulesDefinition.MinimumStandoffPeriod.Value)
        {
            throw new Exception("Ballot voting period starts too soon from ballot creation than what is allowed in the HCS Voting Stream rules.");
        }
        if (rulesDefinition.MinimumRequiredVotingThreshold.HasValue && createMessage.RequiredThreshold.HasValue && createMessage.RequiredThreshold.Value < rulesDefinition.MinimumRequiredVotingThreshold.Value)
        {
            throw new Exception("Ballot required voting threshold is smaller than what is allowed in the HCS Voting Stream rules.");
        }
        var currentTime = CurrentTime();
        if (currentTime.CompareTo(createMessage.StartTimestamp) < 0)
        {
            throw new Exception("Voting has not started for this proposal.");
        }
        if (currentTime.CompareTo(createMessage.EndTimestamp) < 0)
        {
            throw new Exception("Voting has not completed for this proposal.");
        }
        var tokenInfo = await GetHcsTokenInfo(createMessage.TokenId);
        if (tokenInfo is null)
        {
            throw new Exception("Proposal Voting Token was not found.");
        }
        if (tokenInfo.Deleted)
        {
            throw new Exception("Proposal Voting Token has been deleted.");
        }
        if (hcsCreateMessage.ConsensusTimestamp.CompareTo(tokenInfo.CreatedTimestamp) <= 0)
        {
            throw new Exception("Proposal was created before its voting token was created.");
        }
        if (!"FUNGIBLE_COMMON".Equals(tokenInfo.TokenType))
        {
            throw new Exception("Proposal does not utilize a fungible voting token.");
        }
        var threshold = 0UL;
        var requiredThresholdFraction = createMessage.RequiredThreshold ?? rulesDefinition.MinimumRequiredVotingThreshold.GetValueOrDefault();
        var ineligible = (createMessage.IneligibleAccounts ?? Array.Empty<string>()).Union(rulesDefinition.IneligibleAccounts ?? Array.Empty<string>()).ToArray();
        if (requiredThresholdFraction > 0.0)
        {
            if (!ulong.TryParse(tokenInfo.Circulation, out ulong circulation))
            {
                throw new Exception("Voting token total supply is not available.");
            }
            if (ineligible.Length > 0)
            {
                var ineligibleBalances = 0UL;
                foreach (var addr in ineligible)
                {
                    var tokenBalance = await GetTokenBalanceAsync(addr, createMessage.TokenId, createMessage.StartTimestamp);
                    if (tokenBalance is not null && tokenBalance.Balance > 0)
                    {
                        ineligibleBalances = ineligibleBalances + tokenBalance.Balance;
                    }
                }
                threshold = (ulong)Math.Ceiling(requiredThresholdFraction * (circulation - ineligibleBalances));
            }
            else
            {
                threshold = (ulong)Math.Ceiling(requiredThresholdFraction * circulation);
            }
        }
        proposalInfo = new ProposalInfo
        {
            ProposalId = proposalId,
            TokenId = createMessage.TokenId,
            TopicId = hcsCreateMessage.TopicId,
            Choices = createMessage.Choices,
            StartVoting = createMessage.StartTimestamp,
            EndVoting = createMessage.EndTimestamp,
            RequiredTinyToken = threshold,
            IneligibleAccounts = ineligible
        };
    }
    catch (Exception ex)
    {
        throw new Exception($"Invalid Proposal with ID {proposalId}: {ex.Message}");
    }
}

async Task GatherVotes()
{
    await foreach (var hcsMessage in GetValidHcsMessagesInRange(proposalInfo.TopicId, proposalInfo.StartVoting, proposalInfo.EndVoting))
    {
        var voteMessage = ParseVoteHcsMessage(hcsMessage);
        if (voteMessage is not null &&
            "cast-vote".Equals(voteMessage.MessageType) &&
            proposalId.Equals(voteMessage.ProposalId) &&
            proposalInfo.StartVoting.CompareTo(hcsMessage.ConsensusTimestamp) <= 0 &&
            proposalInfo.EndVoting.CompareTo(hcsMessage.ConsensusTimestamp) >= 0 &&
            voteMessage.Vote.HasValue &&
            voteMessage.Vote.Value >= 0 &&
            voteMessage.Vote.Value < proposalInfo.Choices.Length &&
            !proposalInfo.IneligibleAccounts.Contains(hcsMessage.PayerId))
        {
            var tokenBalance = await GetTokenBalanceAsync(hcsMessage.PayerId, proposalInfo.TokenId, proposalInfo.StartVoting);
            if (tokenBalance is not null && tokenBalance.Balance > 0)
            {
                votes[hcsMessage.PayerId] = new Vote
                {
                    Choice = voteMessage.Vote.Value,
                    Balance = tokenBalance.Balance
                };
            }
        }
    }
}

HcsVoteMessage ParseVoteHcsMessage(HcsMessage hcsMessage)
{
    try
    {
        var jsonMessage = Convert.FromBase64String(hcsMessage.Message);
        return JsonSerializer.Deserialize<HcsVoteMessage>(jsonMessage);
    }
    catch (JsonException)
    {
        // Not a valid message.
    }
    return null;
}

void TallyVotes()
{
    winner = 0;
    var tot = 0ul;
    tally = new ulong[proposalInfo.Choices.Length];
    foreach (var vote in votes.Values)
    {
        tally[vote.Choice] = tally[vote.Choice] + vote.Balance;
        tot = tot + vote.Balance;
    }
    if (tot < proposalInfo.RequiredTinyToken)
    {
        winner = -2;
    }
    else
    {
        // If more than 2 choices, assume last is Abstain
        var list = tally.Length > 2 ? tally.Take(tally.Length - 1).ToArray() : tally;
        for (int i = 1; i < list.Length; i++)
        {
            if (list[i] > list[winner])
            {
                winner = i;
            }
        }
        // Double Check for Ties
        if (list.Count(t => t == list[winner]) > 1)
        {
            winner = -1;
        }
    }
}

void ComputeHash()
{
    hashValue = Convert.ToHexString(MD5.Create().ComputeHash(Encoding.ASCII.GetBytes(hashData))).ToLower();
}

void CreateHashData()
{
    var data = new StringBuilder();
    data.Append(proposalInfo.ProposalId);
    data.Append($"|{proposalInfo.RequiredTinyToken}");
    foreach (var account in votes.Keys.OrderBy(a => a).ToArray())
    {
        var vote = votes[account];
        data.Append($"|{account}-{vote.Choice}-{vote.Balance}");
    }
    for (int i = 0; i < tally.Length; i++)
    {
        data.Append($"|{i}.{tally[i]}");
    }
    data.Append($"|{winner}");
    if (winner > -1)
    {
        data.Append(':');
        data.Append(proposalInfo.Choices[winner]);
    }
    hashData = data.ToString();
}

async Task<HcsMessage> GetHcsMessageByConsensusTimestamp(string consensusTimestamp)
{
    await using var stream = await client.GetStreamAsync($"{mirrorNodeUrl}/api/v1/topics/messages/{consensusTimestamp}");
    var hcsMessage = JsonSerializer.Deserialize<HcsMessage>(stream);
    if (hcsMessage is null)
    {
        throw new Exception($"HCS Message at timestamp {consensusTimestamp} was not found.");
    }
    return ValidateHcsMessage(hcsMessage);
}

async Task<HcsMessage> GetFirstHcsMessageInTopic(string hcsTopic)
{
    await using var stream = await client.GetStreamAsync($"{mirrorNodeUrl}/api/v1/topics/{hcsTopic}/messages/1");
    var hcsMessage = JsonSerializer.Deserialize<HcsMessage>(stream);
    if (hcsMessage is null)
    {
        throw new Exception($"First HCS Message in stream {hcsTopic} appears to be empty.");
    }
    return ValidateHcsMessage(hcsMessage);
}

void OutputResults()
{
    Console.WriteLine(JsonSerializer.Serialize(new Attestation
    {
        MessageType = "attest-results",
        ProposalId = proposalInfo.ProposalId,
        Tally = tally,
        Result = winner,
        Hash = hashValue
    }, new JsonSerializerOptions { WriteIndented = true }));
}

async IAsyncEnumerable<HcsMessage> GetValidHcsMessagesInRange(string topicId, string startTime, string endTime)
{
    var path = $"/api/v1/topics/{topicId}/messages?limit=100&order=asc&timestamp=gt:{startTime}&timestamp=lt:{endTime}";
    do
    {
        await using var stream = await client.GetStreamAsync($"{mirrorNodeUrl}{path}");
        var hcsMessageList = JsonSerializer.Deserialize<HcsMessageList>(stream);
        if (hcsMessageList is not null && hcsMessageList.Messages is not null)
        {
            foreach (var hcsMessage in hcsMessageList.Messages)
            {
                if (hcsMessage is not null &&
                    hcsMessage.ChunkInfo is null &&
                    !string.IsNullOrWhiteSpace(hcsMessage.Message) &&
                    IsAddress(hcsMessage.TopicId) &&
                    IsAddress(hcsMessage.PayerId))
                {
                    yield return hcsMessage;
                }
            }
        }
        path = hcsMessageList?.NextLink?.Path;
    }
    while (!string.IsNullOrWhiteSpace(path));
}

async Task<HcsTokenInfo> GetHcsTokenInfo(string tokenId)
{
    await using var stream = await client.GetStreamAsync($"{mirrorNodeUrl}/api/v1/tokens/{tokenId}");
    var hcsToken = JsonSerializer.Deserialize<HcsTokenInfo>(stream);
    if (hcsToken is null)
    {
        throw new Exception($"HTS Token {tokenId} was not found.");
    }
    return hcsToken;
}

async Task<TokenBalance> GetTokenBalanceAsync(string accountId, string tokenId, string timestamp)
{
    await using var stream = await client.GetStreamAsync($"{mirrorNodeUrl}/api/v1/tokens/{tokenId}/balances?account.id={accountId}&timestamp=lte:{timestamp}");
    var hcsBalanceList = JsonSerializer.Deserialize<TokenBalanceList>(stream);
    var record = hcsBalanceList?.Balances?.FirstOrDefault(r => r.Account == accountId);
    if (record is not null)
    {
        return record;
    }
    return null;
}

bool IsTimestamp(string value)
{
    return Regex.IsMatch(value, @"^\d+\.\d+$");
}

bool IsAddress(string value)
{
    return Regex.IsMatch(value, @"^\d+\.\d+\.\d+$");
}

bool IsAddressArrayOrUndefined(string[] value)
{
    if (value is not null && value.Length > 0)
    {
        foreach (var addr in value)
        {
            if (!IsAddress(addr))
            {
                return false;
            }
        }
    }
    return true;
}

bool IsFractionOrUndefined(double? value)
{
    return !(value.HasValue && (value.Value < 0 || value.Value > 1));
}

bool IsNonNegativeOrUndefined(double? value)
{
    return !(value.HasValue && value.Value < 0);
}

double ComputeDiffInDays(string startingTimestamp, string endingTimestamp)
{
    var startingSeconds = double.Parse(startingTimestamp);
    var endingSeconds = double.Parse(endingTimestamp);
    return (endingSeconds - startingSeconds) / 86400.0;
}

string CurrentTime()
{
    TimeSpan timespan = DateTime.UtcNow - DateTime.UnixEpoch;
    long seconds = (long)timespan.TotalSeconds;
    int nanos = (int)((timespan.Ticks - (seconds * TimeSpan.TicksPerSecond)) * NanosPerTick);
    return $"{seconds}.{nanos.ToString().PadLeft(9, '0')}";
}

HcsMessage ValidateHcsMessage(HcsMessage hcsMessage)
{
    if (hcsMessage.ChunkInfo is not null)
    {
        throw new Exception($"HCS Message {hcsMessage.SequenceNumber} has chunks, which are not supported.");
    }
    if (string.IsNullOrWhiteSpace(hcsMessage.Message))
    {
        throw new Exception($"HCS Message {hcsMessage.SequenceNumber} has no message payload.");
    }
    if (!IsAddress(hcsMessage.TopicId))
    {
        throw new Exception($"HCS Message {hcsMessage.SequenceNumber} does not have a valid topic id.");
    }
    if (!IsAddress(hcsMessage.PayerId))
    {
        throw new Exception($"HCS Message {hcsMessage.SequenceNumber} does not have a valid payer id.");
    }
    return hcsMessage;
}

public record ProposalInfo
{
    public string ProposalId { get; init; }
    public string TopicId { get; init; }
    public string TokenId { get; init; }
    public string[] Choices { get; init; }
    public string StartVoting { get; init; }
    public string EndVoting { get; init; }
    public ulong RequiredTinyToken { get; set; }
    public string[] IneligibleAccounts { get; set; }
}

public record Vote
{
    public int Choice { get; init; }
    public ulong Balance { get; init; }
}

public record Attestation
{
    [JsonPropertyName("type")]
    public string MessageType { get; set; }
    [JsonPropertyName("ballotId")]
    public string ProposalId { get; set; }
    [JsonPropertyName("tally")]
    public ulong[] Tally { get; set; }
    [JsonPropertyName("result")]
    public int Result { get; set; }
    [JsonPropertyName("hash")]
    public string Hash { get; set; }
}

public class HcsCreateProposalMessage
{
    [JsonPropertyName("type")]
    public string MessageType { get; set; }
    [JsonPropertyName("tokenId")]
    public string TokenId { get; set; }
    [JsonPropertyName("title")]
    public string Title { get; set; }
    [JsonPropertyName("description")]
    public string Description { get; set; }
    [JsonPropertyName("discussion")]
    public string Discussion { get; set; }
    [JsonPropertyName("scheme")]
    public string Scheme { get; set; }
    [JsonPropertyName("choices")]
    public string[] Choices { get; set; }
    [JsonPropertyName("startTimestamp")]
    public string StartTimestamp { get; set; }
    [JsonPropertyName("endTimestamp")]
    public string EndTimestamp { get; set; }
    [JsonPropertyName("threshold")]
    public double? RequiredThreshold { get; set; }
    [JsonPropertyName("ineligible")]
    public string[] IneligibleAccounts { get; set; }
}

public class HcsRulesMessage
{
    [JsonPropertyName("type")]
    public string MessageType { get; set; }
    [JsonPropertyName("title")]
    public string Title { get; set; }
    [JsonPropertyName("description")]
    public string Description { get; set; }
    [JsonPropertyName("tokenId")]
    public string TokenId { get; set; }
    [JsonPropertyName("minVotingThreshold")]
    public double? MinimumRequiredVotingThreshold { get; set; }
    [JsonPropertyName("ineligibleAccounts")]
    public string[] IneligibleAccounts { get; set; }
    [JsonPropertyName("ballotCreators")]
    public string[] BallotCreators { get; set; }
    [JsonPropertyName("minimumVotingPeriod")]
    public double? MinimumVotingPeriod { get; set; }
    [JsonPropertyName("minimumStandoffPeriod")]
    public double? MinimumStandoffPeriod { get; set; }
}

public class HcsVoteMessage
{
    [JsonPropertyName("type")]
    public string MessageType { get; set; }
    [JsonPropertyName("ballotId")]
    public string ProposalId { get; set; }
    [JsonPropertyName("vote")]
    public int? Vote { get; set; }
}

public class HcsMessageList
{
    [JsonPropertyName("links")]
    public HcsLink NextLink { get; set; }
    [JsonPropertyName("messages")]
    public HcsMessage[] Messages { get; set; }
}

public class HcsMessage
{
    [JsonPropertyName("chunk_info")]
    public HcsChunkInfo ChunkInfo { get; set; }
    [JsonPropertyName("consensus_timestamp")]
    public string ConsensusTimestamp { get; set; }
    [JsonPropertyName("message")]
    public string Message { get; set; }
    [JsonPropertyName("payer_account_id")]
    public string PayerId { get; set; }
    [JsonPropertyName("running_hash")]
    public string RunningHash { get; set; }
    [JsonPropertyName("running_hash_version")]
    public int RunningHashVersion { get; set; }
    [JsonPropertyName("sequence_number")]
    public ulong SequenceNumber { get; set; }
    [JsonPropertyName("topic_id")]
    public string TopicId { get; set; }
}

public class HcsChunkInfo
{
    // Chunk Info is not supported, therefore
    // we have no need to define any properties
    // here, we only need to know if the chunk
    // existed, if it does, we ignore the message.
}

public class HcsTokenInfo
{
    [JsonPropertyName("created_timestamp")]
    public string CreatedTimestamp { get; set; }
    [JsonPropertyName("type")]
    public string TokenType { get; set; }
    [JsonPropertyName("total_supply")]
    public string Circulation { get; set; }
    [JsonPropertyName("deleted")]
    public bool Deleted { get; set; }
}

public class TokenBalanceList
{
    [JsonPropertyName("timestamp")]
    public string TimeStamp { get; set; }
    [JsonPropertyName("balances")]
    public TokenBalance[] Balances { get; set; }
}

public class TokenBalance
{
    [JsonPropertyName("account")]
    public string Account { get; set; }
    [JsonPropertyName("balance")]
    public ulong Balance { get; set; }
}

public class HcsLink
{
    [JsonPropertyName("next")]
    public string Path { get; set; }
}