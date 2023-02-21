#pragma warning disable CS8618
using Hashgraph;
using System.Text.Json.Serialization;
using VotingStream.Mappers;

namespace VotingStream.Models;
/// <summary>
/// Contains information regarding the state and 
/// configuration of this VotingStream server.
/// </summary>
public class RulesDefinition
{
    /// <summary>
    /// Message discriminator as appears in source JSON
    /// </summary>
    [JsonPropertyName("type")]
    public string MessageType { get; set; }
    /// <summary>
    /// A short title describing this HCS voting stream. 
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; set; }
    /// <summary>
    /// A short description of the purpose of this HCS voting stream. 
    /// </summary>
    [JsonPropertyName("description")]
    public string Description { get; set; }
    /// <summary>
    /// The Voting Token in 0.0.123 format.
    /// </summary>
    [JsonPropertyName("tokenId")]
    [JsonConverter(typeof(AddressConverter))]
    public Address TokenId { get; set; }
    /// <summary>
    /// The minimum fraction of eligible balance that must vote for or 
    /// against a proposal.  (the sum of the balance of ineligible 
    /// accounts does not count in the quorum computation). 
    /// </summary>
    /// <remarks>
    /// Each proposal definition may, in turn, specify a higher threshold 
    /// value than what is specified here, but may not specify a value 
    /// lower than what is defined here.If a proposal does not specify a 
    /// threshold value in its definition, the value defined here will apply.
    /// </remarks>
    [JsonPropertyName("minVotingThreshold")]
    public decimal MinimumVotingThreshold { get; set; }
    /// <summary>
    ///An array of crypto and/or contract accounts that are not allowed to 
    ///participate in voting.The proposals threshold will not consider their 
    ///balances when computing quorom requirements.The HCS protocol allows 
    ///each proposal to define a a list of inelegible accounts in addition 
    ///to what is defined here for each proposed ballot.  The resulting 
    ///list of inelegible accounts will be the union of the two lists.
    /// </summary>
    [JsonPropertyName("ineligibleAccounts")]
    [JsonConverter(typeof(AddressArrayConverter))]
    public Address[] IneligibleAccounts { get; set; }
    /// <summary>
    /// The list of contracts or accounts that are allowed to 
    /// post ballot proposals into this stream.If specified, 
    /// only ballot proposal definitions posted by accounts in 
    /// this list will be considered valid.Validators must 
    /// reject ballot proposals not created by one of these 
    /// listed accounts(in other words, one of these accounts 
    /// must be the payer of the transaction submitting the 
    /// HCS create ballot message)
    /// </summary>
    /// <remarks>
    /// An empty list indicates that any account or contract 
    /// may create a ballot for this voting stream.
    /// </remarks>
    [JsonPropertyName("ballotCreators")]
    [JsonConverter(typeof(AddressArrayConverter))]
    public Address[] BallotCreators { get; set; }
    /// <summary>
    /// The minimum voting window allowed (in days) for a ballot 
    /// proposal to be considered valid.If not specified the 
    /// creator of the ballot may specify any voting window as 
    /// small or large as desired.
    /// </summary>
    [JsonPropertyName("minimumVotingPeriod")]
    public int MinimumVotingPeriod { get; set; }
    /// <summary>
    /// The minimum standoff for the beginning a voting window 
    /// (in days) from the creation of a ballot.If not specified 
    /// a ballot window can open immediately upon creation of a 
    /// proposal ballot, otherwise to be considered valid, the 
    /// ballot's voting start period must be at least the 
    /// specified abount of days after the creation of the ballot.
    /// </summary>
    [JsonPropertyName("minimumStandoffPeriod")]
    public int MinimumStandoffPeriod { get; set; }
}
