using Hashgraph;
using System.Net;

namespace VotingStream.Mirror;
/// <summary>
/// The Mirror Node REST Client.
/// </summary>
public class MirrorRestClient
{
    /// <summary>
    /// The base REST endpoint for the mirror node.
    /// </summary>
    private readonly string _endpointUrl;
    /// <summary>
    /// The underlying http client connecting to the mirror node.
    /// </summary>
    private readonly HttpClient _client;
    /// <summary>
    /// The remote mirror node endpoint url.
    /// </summary>
    public string EndpointUrl => _endpointUrl;
    /// <summary>
    /// Constructor, requires the mirror node’s base REST API endpoint url.
    /// </summary>
    /// <param name="endpointUrl">
    /// The mirror node’s base REST API endpoint url.
    /// </param>
    public MirrorRestClient(string endpointUrl)
    {
        _endpointUrl = endpointUrl.EndsWith('/') ? endpointUrl[..^1] : endpointUrl;
        _client = new HttpClient();
    }
    /// <summary>
    /// Retrieves the list of known Hedera Gossip Nodes.
    /// </summary>
    /// <returns>
    /// The list of known Hedera Gossip Nodes.
    /// </returns>
    public IAsyncEnumerable<GossipNode> GetGossipNodesAsync()
    {
        return GetPagedItems<GossipNodeList, GossipNode>("network/nodes");
    }
    /// <summary>
    /// Retrieves information for the given token.
    /// </summary>
    /// <param name="tokenId">
    /// Id of the token to retrieve.
    /// </param>
    /// <param name="timestamp">
    /// The consensus timestamp snapshot at which the information is desired, 
    /// for the latest, specify null.
    /// </param>
    /// <returns>
    /// The token information.
    /// </returns>
    public Task<TokenInfo?> GetTokenInfo(Address tokenId, ConsensusTimeStamp? timestamp = null)
    {
        var path = timestamp.HasValue ?
            $"tokens/{tokenId}?timestamp={timestamp}" :
            $"tokens/{tokenId}";
        return GetSingleItem<TokenInfo?>(path);
    }
    /// <summary>
    /// Retrieves an HCS message with the given token and sequence number.
    /// </summary>
    /// <param name="topicId">
    /// The HCS message topic to retrieve.
    /// </param>
    /// <param name="sequenceNumber">
    /// The sequence number of message within the token stream to retrieve.
    /// </param>
    /// <returns>
    /// The HCS Message information or null if not found.
    /// </returns>    
    public Task<HcsMessage?> GetHcsMessageAsync(Address topicId, ulong sequenceNumber)
    {
        return GetSingleItem<HcsMessage?>($"topics/{topicId}/messages/{sequenceNumber}");
    }
    /// <summary>
    /// Retrieves the latest known HCS message in a stream submitted prior to 
    /// the given timestamp.
    /// </summary>
    /// <param name="topicId">
    /// The topic id of the HCS stream.
    /// </param>
    /// <param name="timeStamp">
    /// The timestamp mark to compare against.
    /// </param>
    /// <returns>
    /// The latest known HCS message in a stream submitted prior to the given timestamp.
    /// </returns>
    public async Task<HcsMessage?> GetLatestHcsMessagePriorToTimestampAsync(Address topicId, ConsensusTimeStamp timeStamp)
    {
        var query = QueryString.Create("limit", "1");
        query = query.Add("order", "desc");
        query = query.Add("timestamp", $"lt:{timeStamp}");
        var record = await GetSingleItem<HcsMessageList>($"topics/{topicId}/messages{query.ToUriComponent()}");
        if (record is not null && record.Messages is not null && record.Messages.Length > 0)
        {
            return record.Messages[0];
        }
        return null;
    }
    /// <summary>
    /// Retrieves a list of HCS message.  Messages may be filtered by a starting 
    /// sequence number or consensus timestamp.
    /// </summary>
    /// <param name="topicId">
    /// The topic id of the HCS stream.
    /// </param>
    /// <param name="afterSequenceNumber">
    /// If specified, only return messages having a sequence number larger 
    /// than this value.
    /// </param>
    /// <param name="afterTimeStamp">
    /// If specified, only return messages having a consensus timestamp 
    /// after this value.
    /// </param>
    /// <returns>
    /// An enumerable of HCS Messages meeting the given criteria, may be empty if 
    /// none are found.
    /// </returns>
    public IAsyncEnumerable<HcsMessage> GetHcsMessagesAsync(Address topicId, ulong? afterSequenceNumber = null, ConsensusTimeStamp? afterTimeStamp = null)
    {
        var query = QueryString.Create("limit", "100");
        if (afterSequenceNumber.HasValue)
        {
            query = query.Add("sequencenumber", $"gt:{afterSequenceNumber.Value}");
        }
        if (afterTimeStamp.HasValue)
        {
            query = query.Add("timestamp", $"gt:{afterTimeStamp.Value}");
        }
        return GetPagedItems<HcsMessageList, HcsMessage>($"topics/{topicId}/messages{query.ToUriComponent()}");
    }
    /// <summary>
    /// Waits for an HCS message with the given topic id and sequence number to 
    /// appear in the list of messages for the topic.  Do not call unless it is 
    /// strictly known that this message exits because it will wait for the message 
    /// to appear in the output, retyring all 404 errors until successfully retrieved.
    /// </summary>
    /// <param name="topicId">
    /// The topic id of the HCS stream.
    /// </param>
    /// <param name="sequenceNumber">
    /// Sequence number to wait for.
    /// </param>
    /// <returns>
    /// The HCS message information, waiting for it if necessary for a 
    /// reasonable amount of retries.
    /// </returns>
    public async Task<HcsMessage?> WaitForHcsMessageAsync(Address topicId, long sequenceNumber)
    {
        var count = 0;
        while (true)
        {
            try
            {
                return await GetSingleItem<HcsMessage?>($"topics/{topicId}/messages/{sequenceNumber}");
            }
            catch (HttpRequestException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound && count < 30)
                {
                    count++;
                    await Task.Delay(7000);
                    continue;
                }
                throw;
            }
        }
    }
    /// <summary>
    /// Retrieves the token balance for an account and given token.
    /// </summary>
    /// <param name="accountId">
    /// The account ID.
    /// </param>
    /// <param name="tokenId">
    /// The token ID
    /// </param>
    /// <param name="timestamp">
    /// Optional value indicating the information is required for the 
    /// specified consensus timestamp.
    /// </param>
    /// <returns>
    /// A token balance object if a record was found for the given 
    /// timestamp, otherwise null.
    /// </returns>
    public async Task<TokenBalance?> GetTokenBalanceAsync(Address accountId, Address tokenId, ConsensusTimeStamp? timestamp = null)
    {
        var path = timestamp.HasValue ?
            $"tokens/{tokenId}/balances?account.id={accountId}&timestamp=lte:{timestamp}" :
            $"tokens/{tokenId}/balances?account.id={accountId}";
        var payload = await GetSingleItem<TokenBalanceList>(path);
        var record = payload?.Balances?.FirstOrDefault(r => r.Account == accountId);
        if (record is not null)
        {
            return record;
        }
        return null;
    }
    /// <summary>
    /// Retrieves a list of non-zero balances for a given token.
    /// </summary>
    /// <param name="tokenId">
    /// The token ID
    /// </param>
    /// <param name="timestamp">
    /// Optional value indicating the information is required for the 
    /// specified consensus timestamp.
    /// </param>
    /// <returns>
    /// A list of balances for holders of the token only if their 
    /// balance is greater than zero.
    /// </returns>
    public IAsyncEnumerable<TokenBalance> GetNonZeroTokenBalalancesAsync(Address tokenId, ConsensusTimeStamp? timestamp = null)
    {
        //https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.13146/balances?account.balance=gt:0&limit=100&timestamp=1676495600.031014000
        var path = timestamp.HasValue ?
            $"tokens/{tokenId}/balances?account.balance=gt:0&limit=100&timestamp={timestamp.Value}" :
            $"tokens/{tokenId}/balances?account.balance=gt:0&limit=100";
        return GetPagedItems<TokenBalanceList, TokenBalance>(path);
    }
    /// <summary>
    /// Retrieves the latest consensus timestamp known by the mirror node.
    /// </summary>
    /// <returns>
    /// The latest consensus timestamp known by the mirror node.
    /// </returns>
    public async Task<ConsensusTimeStamp> GetLatestTransactionTimestampAsync()
    {
        var list = await GetSingleItem<TransactionList>("transactions?limit=1&order=desc");
        if (list?.Transactions?.Length > 0)
        {
            return list.Transactions[0].TimeStamp;
        }
        return ConsensusTimeStamp.MinValue;
    }
    /// <summary>
    /// Retrieves the consensus timestamp of the latest submitted HCS message 
    /// for a given topic.
    /// </summary>
    /// <param name="topicId">
    /// The topic ID.
    /// </param>
    /// <returns>
    /// The consensus timestamp of the latest submitted HCS message for a given topic.
    /// </returns>
    public async Task<ConsensusTimeStamp> GetLatestMessageTimestampAsync(Address topicId)
    {
        var list = await GetSingleItem<HcsMessageList>($"topics/{topicId}/messages?limit=1&order=desc");
        if (list?.Messages?.Length > 0)
        {
            return list.Messages[0].TimeStamp;
        }
        return ConsensusTimeStamp.MinValue;
    }
    /// <summary>
    /// Internal helper function to retrieve a paged items structured
    /// object, converting it into an IAsyncEnumerable for consumption.
    /// </summary>
    private async IAsyncEnumerable<TItem> GetPagedItems<TList, TItem>(string path) where TList : PagedList<TItem>
    {
        var fullPath = "/api/v1/" + path;
        do
        {
            var payload = await _client.GetFromJsonAsync<TList>(_endpointUrl + fullPath);
            if (payload is not null)
            {
                foreach (var item in payload.GetItems())
                {
                    yield return item;
                }
            }
            fullPath = payload?.Links?.Next;
        }
        while (!string.IsNullOrWhiteSpace(fullPath));
    }
    /// <summary>
    /// Helper function to retreive a single item from the rest api call.
    /// </summary>
    private async Task<TItem?> GetSingleItem<TItem>(string path)
    {
        var fullPath = "/api/v1/" + path;
        return await _client.GetFromJsonAsync<TItem>(_endpointUrl + fullPath);
    }
}
