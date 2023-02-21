#pragma warning disable CS8618
using Hashgraph;
using System.Text.Json.Serialization;
using VotingStream.Mappers;

namespace VotingStream.Models;
/// <summary>
/// Represents an HCS Voting Stream Create Proposal Ballot message.
/// </summary>
public class CreateProposalMessage
{
    /// <summary>
    /// The type of HCS Voting Message, must be 'create-ballot'.
    /// </summary>
    [JsonPropertyName("type")]
    public string MessageType { get; set; }
    /// <summary>
    /// The voting token associated with this proposal, in 0.0.123 string format.
    /// </summary>
    [JsonPropertyName("tokenId")]
    [JsonConverter(typeof(AddressConverter))]
    public Address TokenId { get; set; }
    /// <summary>
    /// The title of the proposal.
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; set; }
    /// <summary>
    /// A url (typ. IPFS) to a document describing the details of the proposal.
    /// </summary>
    [JsonPropertyName("description")]
    public string Description { get; set; }
    /// <summary>
    /// A Url to the public discussion link for the proposal.
    /// </summary>
    [JsonPropertyName("discussion")]
    public string Discussion { get; set; }
    /// <summary>
    /// The identifier of the voting scheme to use, at this time only
    /// 'single-choice' is supported.
    /// </summary>
    [JsonPropertyName("scheme")]
    public string Scheme { get; set; }
    /// <summary>
    /// An array of choices that may be cast.  At this time the first is
    /// 'Yes' (index 0) and the second is 'No' (index 1) and the third
    /// (index 2) is 'Abstain'.  The system will treat the first in the
    /// list as the affirmative vote and all others as non-affirmative votes.
    /// </summary>
    [JsonPropertyName("choices")]
    public string[] Choices { get; set; }
    /// <summary>
    /// The date and time voting for this proposal may commence,
    /// in hedera 0000.0000 epoch string format.
    /// </summary>
    [JsonPropertyName("startTimestamp")]
    [JsonConverter(typeof(ConsensusTimeStampConverter))]
    public ConsensusTimeStamp StartTimestamp { get; set; }
    /// <summary>
    /// The date and time voting for this proposal ceases,
    /// in hedera 0000.0000 epoch string format.
    /// </summary>
    [JsonPropertyName("endTimestamp")]
    [JsonConverter(typeof(ConsensusTimeStampConverter))]
    public ConsensusTimeStamp EndTimestamp { get; set; }
    /// <summary>
    /// The minimum fraction of voting token balance that must
    /// participate in ballot voting for the proposal tally to
    /// be considered valid.Does not consider the balances of
    /// ineligible acocunts in the calculation.
    /// </summary>
    [JsonPropertyName("threshold")]
    public decimal? RequiredThreshold { get; set; }
    /// <summary>
    /// A list of accounts that may not participate in this
    /// proposal ballot vote.
    /// </summary>
    [JsonPropertyName("ineligible")]
    [JsonConverter(typeof(AddressArrayConverter))]
    public Address[] IneligibleAccounts { get; set; }
}
