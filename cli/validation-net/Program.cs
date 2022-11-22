#nullable disable
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

DateTime EPOCH = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
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
        var hcsMessage = await GetHcsMessageByConsensusTimestamp(proposalId);
        var jsonMessage = Convert.FromBase64String(hcsMessage.Message);
        var createMessage = JsonSerializer.Deserialize<HcsCreateProposalMessage>(jsonMessage);
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
        if (hcsMessage.ConsensusTimestamp.CompareTo(createMessage.StartTimestamp) >= 0)
        {
            throw new Exception("Proposal Voting Starting Time preceeds Proposal Creation Time.");
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
        if (createMessage.RequiredThreshold.HasValue)
        {
            if (createMessage.RequiredThreshold.Value < 0.0 || createMessage.RequiredThreshold.Value > 1.0)
            {
                throw new Exception("Proposal threshold is out of valid range of [0,1].");
            }
        }
        if (createMessage.IneligibleAcocunts is not null && createMessage.IneligibleAcocunts.Length > 0)
        {
            foreach (var addr in createMessage.IneligibleAcocunts)
            {
                if (!IsAddress(addr))
                {
                    throw new Exception("Proposal definition contains an invalid ineligible address.");
                }
            }
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
        if (hcsMessage.ConsensusTimestamp.CompareTo(tokenInfo.CreatedTimestamp) <= 0)
        {
            throw new Exception("Proposal was created before its voting token was created.");
        }
        if (!"FUNGIBLE_COMMON".Equals(tokenInfo.TokenType))
        {
            throw new Exception("Proposal does not utilize a fungible voting token.");
        }
        var threshold = 0UL;
        var ineligible = createMessage.IneligibleAcocunts ?? Array.Empty<string>();
        if (createMessage.RequiredThreshold.GetValueOrDefault() > 0.0)
        {
            if (ineligible.Length > 0)
            {
                var ineligibleBalances = 0UL;
                foreach (var addr in ineligible)
                {
                    var balanceList = await GetHcsAccountBalance(addr, proposalInfo.StartVoting);
                    if (balanceList is not null &&
                        proposalInfo.StartVoting.CompareTo(balanceList.Timestamp) >= 0 &&
                        balanceList.AccountBalances is not null &&
                        balanceList.AccountBalances.Length == 1)
                    {
                        var balances = balanceList.AccountBalances[0];
                        if (balances is not null &&
                            addr.Equals(balances.Account) &&
                            balances.Tokens is not null)
                        {
                            var tokenBalance = balances.Tokens.FirstOrDefault(b => proposalInfo.TokenId.Equals(b.TokenId));
                            if (tokenBalance is not null &&
                                tokenBalance.Balance > 0)
                            {
                                ineligibleBalances = ineligibleBalances + tokenBalance.Balance;
                            }
                        }
                    }
                }
                threshold = (ulong)Math.Round(createMessage.RequiredThreshold.Value * ((ulong)tokenInfo.Circulation - ineligibleBalances));
            }
            else
            {
                threshold = (ulong)Math.Round(createMessage.RequiredThreshold.Value * tokenInfo.Circulation);
            }
        }
        proposalInfo = new ProposalInfo
        {
            ProposalId = proposalId,
            TokenId = createMessage.TokenId,
            TopicId = hcsMessage.TopicId,
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
        var jsonMessage = Convert.FromBase64String(hcsMessage.Message);
        var voteMessage = JsonSerializer.Deserialize<HcsVoteMessage>(jsonMessage);
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
            var balanceList = await GetHcsAccountBalance(hcsMessage.PayerId, proposalInfo.StartVoting);
            if (balanceList is not null &&
                proposalInfo.StartVoting.CompareTo(balanceList.Timestamp) >= 0 &&
                balanceList.AccountBalances is not null &&
                balanceList.AccountBalances.Length == 1)
            {
                var balances = balanceList.AccountBalances[0];
                if (balances is not null &&
                    hcsMessage.PayerId.Equals(balances.Account) &&
                    balances.Tokens is not null)
                {
                    var tokenBalance = balances.Tokens.FirstOrDefault(b => proposalInfo.TokenId.Equals(b.TokenId));
                    if (tokenBalance is not null &&
                        tokenBalance.Balance > 0)
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
    }
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
        for (int i = 1; i < tally.Length; i++)
        {
            if (tally[i] > tally[winner])
            {
                winner = i;
            }
        }
        // Double Check for Ties
        if (tally.Count(t => t == tally[winner]) > 1)
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

async Task<HcsAccountBalanceList> GetHcsAccountBalance(string accountId, string timestamp)
{
    await using var stream = await client.GetStreamAsync($"{mirrorNodeUrl}/api/v1/balances?account.id={accountId}&timestamp={timestamp}");
    var hcsBalanceList = JsonSerializer.Deserialize<HcsAccountBalanceList>(stream);
    if (hcsBalanceList is null)
    {
        throw new Exception($"Balance for {accountId} was not found.");
    }
    return hcsBalanceList;
}

bool IsTimestamp(string value)
{
    return Regex.IsMatch(value, @"^\d+\.\d+$");
}

bool IsAddress(string value)
{
    return Regex.IsMatch(value, @"^\d+\.\d+\.\d+$");
}

string CurrentTime()
{
    TimeSpan timespan = DateTime.UtcNow - EPOCH;
    long seconds = (long)timespan.TotalSeconds;
    int nanos = (int)((timespan.Ticks - (seconds * TimeSpan.TicksPerSecond)) * NanosPerTick);
    return $"{seconds}.{nanos.ToString().PadLeft(6, '0')}";
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
    public string[] IneligibleAcocunts { get; set; }
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
    [JsonPropertyName("circulation")]
    public long Circulation { get; set; }
    [JsonPropertyName("deleted")]
    public bool Deleted { get; set; }
}

public class HcsAccountBalanceList
{
    [JsonPropertyName("timestamp")]
    public string Timestamp { get; set; }
    [JsonPropertyName("balances")]
    public HcsAccountBalance[] AccountBalances { get; set; }
    [JsonPropertyName("links")]
    public HcsLink Links { get; set; }
}

public class HcsAccountBalance
{
    [JsonPropertyName("account")]
    public string Account { get; set; }
    [JsonPropertyName("balance")]
    public ulong CryptoBalance { get; set; }
    [JsonPropertyName("tokens")]
    public TokenBalance[] Tokens { get; set; }
}

public class TokenBalance
{
    [JsonPropertyName("token_id")]
    public string TokenId { get; set; }
    [JsonPropertyName("balance")]
    public ulong Balance { get; set; }
}

public class HcsLink
{
    [JsonPropertyName("next")]
    public string Path { get; set; }
}