#pragma warning disable CS8618
using Hashgraph;
using System.Text.Json.Serialization;
using VotingStream.Mappers;

namespace VotingStream.Models;
/// <summary>
/// Represents an HCS Voting Stream Create Cast Vote message.
/// </summary>
public class CastVoteMessage
{
    /// <summary>
    /// The type of HCS Voting Message, must be 'create-ballot'.
    /// </summary>
    [JsonPropertyName("type")]
    public string MessageType { get; set; }
    /// <summary>
    /// The consensus timestamp identifying the proposal that
    /// this vote is cast for.
    /// </summary>
    [JsonPropertyName("ballotId")]
    [JsonConverter(typeof(ConsensusTimeStampConverter))]
    public ConsensusTimeStamp ProposalId { get; set; }
    /// <summary>
    /// The vote choice, matches an index from the
    /// proposals choice array.
    /// </summary>
    [JsonPropertyName("vote")]
    public int? Choice { get; set; }

}