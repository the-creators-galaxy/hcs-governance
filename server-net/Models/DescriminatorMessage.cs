#pragma warning disable CS8618
using System.Text.Json.Serialization;

namespace VotingStream.Models;
/// <summary>
/// Class that can be JSON deserialized from
/// bytes to discern the type of HCS message
/// payload was sent.  It contains the property
/// 'type' which is required for all valid
/// Voting Stream Messages.
/// </summary>
public class DescriminatorMessage
{
    /// <summary>
    /// The discriminator field for a HCS Voting
    /// Stream Message used to identify which type
    /// of message this HCS message is.
    /// </summary>
    [JsonPropertyName("type")]
    public string DescriminatorType { get; set; }
}
