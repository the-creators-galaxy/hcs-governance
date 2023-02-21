using Hashgraph;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace VotingStream.Mappers;
/// <summary>
/// Consensus Timestamp JSON Converter
/// </summary>
public class ConsensusTimeStampConverter : JsonConverter<ConsensusTimeStamp>
{
    /// <summary>
    /// Convert a JSON string into a Consensus Timestamp
    /// </summary>
    /// <param name="reader">reader</param>
    /// <param name="typeToConvert">type to convert</param>
    /// <param name="options">json options</param>
    /// <returns>ConsensusTimestamp object</returns>
    public override ConsensusTimeStamp Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (decimal.TryParse(reader.GetString(), out decimal epoch))
        {
            return new ConsensusTimeStamp(epoch);
        }
        return ConsensusTimeStamp.MinValue;
    }
    /// <summary>
    /// Converts a consensus timestamp object into its string representation.
    /// </summary>
    /// <param name="writer">json writer</param>
    /// <param name="timeStamp">timestamp to convert</param>
    /// <param name="options">json options</param>
    public override void Write(Utf8JsonWriter writer, ConsensusTimeStamp timeStamp, JsonSerializerOptions options)
    {
        writer.WriteStringValue(timeStamp.ToString());
    }
}
/// <summary>
/// Account Address JSON Converter
/// </summary>
public class AddressConverter : JsonConverter<Address>
{
    /// <summary>
    /// Convert a JSON string into an Account Address
    /// </summary>
    /// <param name="reader">reader</param>
    /// <param name="typeToConvert">type to convert</param>
    /// <param name="options">json options</param>
    /// <returns>ConsensusTimestamp object</returns>
    public override Address Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (!string.IsNullOrWhiteSpace(value))
        {
            var parts = value.Split('.');
            if (parts.Length == 3)
            {
                if (uint.TryParse(parts[0], out uint shard) &&
                    uint.TryParse(parts[1], out uint realm) &&
                    uint.TryParse(parts[2], out uint number))
                {
                    return new Address(shard, realm, number);
                }
            }
        }
        return Address.None;
    }
    /// <summary>
    /// Converts aacount address object into its string representation.
    /// </summary>
    /// <param name="writer">json writer</param>
    /// <param name="address">address to convert</param>
    /// <param name="options">json options</param>
    public override void Write(Utf8JsonWriter writer, Address address, JsonSerializerOptions options)
    {
        writer.WriteStringValue(address.ToString());
    }
}
/// <summary>
/// Account Address Array JSON Converter
/// </summary>
public class AddressArrayConverter : JsonConverter<Address[]>
{
    /// <summary>
    /// Convert a JSON string array into an Account Address Array
    /// </summary>
    /// <param name="reader">reader</param>
    /// <param name="typeToConvert">type to convert</param>
    /// <param name="options">json options</param>
    /// <returns>ConsensusTimestamp object</returns>
    public override Address[] Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartArray)
        {
            throw new JsonException();
        }
        reader.Read();
        var converter = new AddressConverter();
        var list = new List<Address>();
        while (reader.TokenType != JsonTokenType.EndArray)
        {
            list.Add(converter.Read(ref reader, typeof(Address), options!));
            reader.Read();
        }
        return list.ToArray();
    }
    /// <summary>
    /// Converts aacount address array into its string array representation.
    /// </summary>
    /// <param name="writer">json writer</param>
    /// <param name="addresses">address array to convert</param>
    /// <param name="options">json options</param>
    public override void Write(Utf8JsonWriter writer, Address[] addresses, JsonSerializerOptions options)
    {
        var converter = new AddressConverter();
        writer.WriteStartArray();
        foreach (var address in addresses)
        {
            converter.Write(writer, address, options);
        }
        writer.WriteEndArray();
    }
}