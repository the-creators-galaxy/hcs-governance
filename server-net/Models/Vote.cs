using Hashgraph;
using System.Text.Json.Serialization;
using VotingStream.Mappers;

namespace VotingStream.Models
{
    /// <summary>
    /// Stores the details of a single proposal vote by a token holder.
    /// </summary>
    public record Vote
    {
        /// <summary>
        /// The date and time this vote was cast, 
        /// in hedera 0000.0000 epoch string format.
        /// </summary>
        [JsonPropertyName("consensusTimestamp")]
        [JsonConverter(typeof(ConsensusTimeStampConverter))]
        public ConsensusTimeStamp TimeStamp { get; init; }
        /// <summary>
        /// The hedera account that cast the vote, 
        /// in 0.0.123 string format.
        /// </summary>
        [JsonPropertyName("payerId")]
        [JsonConverter(typeof(AddressConverter))]
        public Address Payer { get; init; }
        /// <summary>
        /// The vote choice, matches an index from the
        /// proposals choice array.
        /// </summary>
        [JsonPropertyName("vote")]
        public int Choice { get; init; }
        /// <summary>
        /// The voter’s associated voting token balance at the time
        /// when the voting window started(ballot’s voting start time),
        /// used to weight the vote among other votes.Enumerated in the
        /// smallest token unit.
        /// </summary>
        [JsonPropertyName("tokenBalance")]
        public long TokenBalance { get; init; }
    }
}
