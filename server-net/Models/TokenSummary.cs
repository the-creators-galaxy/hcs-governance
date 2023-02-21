#pragma warning disable CS8618
using Hashgraph;
using System.Text.Json.Serialization;
using VotingStream.Mappers;

namespace VotingStream.Models;

/// <summary>
/// Represents details of the voting token 
/// attached to this server instance.
/// </summary>
public class TokenSummary
{
    /// <summary>
    /// The hedera token used for voting, in 0.0.123 string format.
    /// </summary>
    [JsonPropertyName("id")]
    [JsonConverter(typeof(AddressConverter))]
    public Address Id { get; set; }
    /// <summary>
    /// The symbol associated with the voting token.
    /// </summary>
    [JsonPropertyName("symbol")]
    public string Symbol { get; set; }
    /// <summary>
    /// The name associated with the voting token.
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; }
    /// <summary>
    /// The unit decimals associated with this token, 
    /// primarily used for display purposes, all calculations 
    /// are performed using the smallest unit of token 
    /// measurement in whole numbers.
    /// </summary>
    [JsonPropertyName("decimals")]
    public int Decimals { get; set; }
    /// <summary>
    /// The current total circulation of token on the ledger, 
    /// in smallest denomination, at the point in time denoted 
    /// on the timestamp.
    /// </summary>
    [JsonPropertyName("circulation")]
    public long Circulation { get; set; }
    /// <summary>
    /// The consensus timestamp at which the information in 
    /// this record is valid (for example, some tokens can change 
    /// their circulation over time, it may be important to know 
    /// the time at which the circulation information was obtained.)
    /// </summary>
    [JsonPropertyName("modified")]
    [JsonConverter(typeof(ConsensusTimeStampConverter))]
    public ConsensusTimeStamp? Modified { get; set; }
}