using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using VotingStream.Mirror;
using VotingStream.Models;

namespace VotingStream.Services;
/// <summary>
/// Internal Helper Functions
/// </summary>
public static class Util
{
    /// <summary>
    /// Attempts to decode an HCS Message payload that was retrieved from 
    /// the mirror node REST API endpoint.
    /// </summary>
    /// <param name="message">
    /// The HCS Message containing the payload to parse.
    /// </param>
    /// <param name="messageBytes">
    /// The bytes retrieved from the message, if successful.
    /// </param>
    /// <returns>
    /// True if parsing the bytes was successful, false if not.
    /// </returns>
    public static bool TryExtractBytesFromMessage(HcsMessage message, [NotNullWhen(true)] out byte[]? messageBytes)
    {
        try
        {
            messageBytes = Convert.FromBase64String(message.Message);
            return true;
        }
        catch
        {
            messageBytes = null;
            return false;
        }
    }
    /// <summary>
    /// Attempts to deserialize a byte array, assuming as JSON into the 
    /// specified object.
    /// </summary>
    /// <typeparam name="T">
    /// The type of object to attempt to deserialize.
    /// </typeparam>
    /// <param name="bytes">
    /// The bytes (utf-8) representing the JSON to deserialize.
    /// </param>
    /// <param name="value">
    /// If successful, contains a reference to the deserialized .net object.
    /// </param>
    /// <returns>
    /// True if deserialization was successful, otherwise false.
    /// </returns>
    public static bool TryDeserializeJson<T>(byte[] bytes, [NotNullWhen(true)] out T? value)
    {
        try
        {
            value = JsonSerializer.Deserialize<T>(bytes);
            return value is not null;
        }
        catch
        {
            // Fall thru
        }
        value = default;
        return false;
    }
    /// <summary>
    /// Helper function that deserializes a distilled form of hcs message 
    /// payload for the purposes of discerning which type of voting message 
    /// the HCS message contains.
    /// </summary>
    /// <param name="messageBytes">
    /// The bytes obtained from the HCS message payload.
    /// </param>
    /// <param name="descriminatorType">
    /// A string containing the contents of the `type` attribute, 
    /// if exists, otherwise null.
    /// </param>
    /// <returns>
    /// True if a type existed on the object, otherwise false.
    /// </returns>
    public static bool TryGetMessageType(byte[] messageBytes, out string descriminatorType)
    {
        if (TryDeserializeJson(messageBytes, out DescriminatorMessage? info))
        {
            descriminatorType = info.DescriminatorType;
            return true;
        }
        descriminatorType = string.Empty;
        return false;
    }
}
