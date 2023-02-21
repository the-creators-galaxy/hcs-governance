#pragma warning disable CS8618
using Hashgraph;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using VotingStream.Mappers;
using VotingStream.Mirror;
using VotingStream.Models;

namespace VotingStream.Services;
/// <summary>
/// Contains information regarding the state and 
/// configuration of this VotingStream server.
/// </summary>
public class VotingStreamConfiguration
{
    /// <summary>
    /// The system wide clock tracking the latest processed consensus timestamp.
    /// </summary>
    private readonly Clock _clock;
    /// <summary>
    /// Reference to the logger
    /// </summary>
    private readonly ILogger<VotingStreamConfiguration> _logger;
    /// <summary>
    /// A short title describing this HCS voting stream. 
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; private set; }
    /// <summary>
    /// A short description of the purpose of this HCS voting stream. 
    /// </summary>
    [JsonPropertyName("description")]
    public string Description { get; private set; }
    /// <summary>
    /// The Mirror Node’s gRPC endpoint.
    /// </summary>
    [JsonPropertyName("mirrorGrpc")]
    public string MirrorGrpc { get; private set; }
    /// <summary>
    /// The Mirror Node’s REST API endpoint.
    /// </summary>
    [JsonPropertyName("mirrorRest")]
    public string MirrorRest { get; private set; }
    /// <summary>
    ///  The HCS Topic message stream source, in 0.0.123 format.
    /// </summary>
    [JsonPropertyName("hcsTopic")]
    [JsonConverter(typeof(AddressConverter))]
    public Address HcsTopic { get; private set; }
    /// <summary>
    /// The Voting Token Information.
    /// </summary>
    [JsonPropertyName("hcsToken")]
    public TokenSummary HcsToken { get; private set; }
    /// <summary>
    /// The consensus time at which to start processing HCS messages.
    /// </summary>
    [JsonPropertyName("hcsStartDate")]
    [JsonConverter(typeof(ConsensusTimeStampConverter))]
    public ConsensusTimeStamp? HcsStartDate { get; private set; }
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
    public decimal MinimumVotingThreshold { get; private set; }
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
    public Address[] IneligibleAccounts { get; private set; }
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
    public Address[] BallotCreators { get; private set; }
    /// <summary>
    /// The minimum voting window allowed (in days) for a ballot 
    /// proposal to be considered valid.If not specified the 
    /// creator of the ballot may specify any voting window as 
    /// small or large as desired.
    /// </summary>
    [JsonPropertyName("minimumVotingPeriod")]
    public decimal MinimumVotingPeriod { get; private set; }
    /// <summary>
    /// The minimum standoff for the beginning a voting window 
    /// (in days) from the creation of a ballot.If not specified 
    /// a ballot window can open immediately upon creation of a 
    /// proposal ballot, otherwise to be considered valid, the 
    /// ballot's voting start period must be at least the 
    /// specified abount of days after the creation of the ballot.
    /// </summary>
    [JsonPropertyName("minimumStandoffPeriod")]
    public decimal MinimumStandoffPeriod { get; private set; }
    /// <summary>
    /// Latest known Consensus Timestamp
    /// </summary>
    [JsonPropertyName("lastUpdated")]
    [JsonConverter(typeof(ConsensusTimeStampConverter))]
    public ConsensusTimeStamp CurrentConsensusTimeStamp => _clock.LatestProcessedTimeStamp;
    /// <summary>
    /// Current version of the running software
    /// </summary>
    [JsonPropertyName("version")]
    public string Version { get; private set; }
    /// <summary>
    /// Constructor, requires prerequisites for setup before attempting to 
    /// validate the configuration.
    /// </summary>
    /// <remarks>
    /// The voting stream configuration is invalid until after the InitAsync 
    /// method is called.
    /// </remarks>
    /// <param name="clock">
    /// The system wide clock tracking the latest processed consensus timestamp.
    /// </param>
    /// <param name="logger">
    /// System logger.
    /// </param>
    public VotingStreamConfiguration(Clock clock, ILogger<VotingStreamConfiguration> logger)
    {
        _clock = clock;
        _logger = logger;
        Version = GetVersionString();
    }
    /// <summary>
    /// Instructs the voting stream configuration to read the environmental 
    /// configuration and retrieve additional information from the HCS voting 
    /// stream for the remainder of the service’s configuration.  This must be 
    /// called during program startup after the dependency injection map has 
    /// been configured.  It is asynchronous and therefore must be called 
    /// separately because the DI framework will not asynchronously 
    /// instantiate dependencies.
    /// </summary>
    /// <param name="configuration">
    /// A asp.net core configuration object, most likely obtained from 
    /// environmental variables.
    /// </param>
    /// <exception cref="VotingStreamException">
    /// If there is a problem with the configuration, such as the voting stream 
    /// topic does not exists, or does not contain configuration or the mirror 
    /// node endpoints are unreachable.
    /// </exception>
    public async Task InitAsync(ConfigurationManager configuration)
    {
        try
        {
            _logger.LogInformation("Loading Configuration from environment");
            MirrorGrpc = configuration["MIRROR_GRPC"] ?? string.Empty;
            if (string.IsNullOrEmpty(MirrorGrpc))
            {
                throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "Missing Mirror GRPC Endpoint in configuration.");
            }
            MirrorRest = configuration["MIRROR_REST"] ?? string.Empty;
            if (string.IsNullOrEmpty(MirrorRest))
            {
                throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "Missing Mirror Rest Endpoint in configuration.");
            }
            if (!TryParseAddress(configuration["HCS_TOPIC"], out Address hcsTopic))
            {
                throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "Invalid HCS Topic in configuration.");
            }
            var client = new MirrorRestClient(MirrorRest);
            var rules = await GetRulesAsync(client, hcsTopic);
            var tokenInfo = await client.GetTokenInfo(rules.TokenId);
            if (tokenInfo is null)
            {
                throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, $"Information for Token {rules.TokenId} not found.");
            }
            HcsToken = new TokenSummary
            {
                Id = rules.TokenId,
                Symbol = tokenInfo.Symbol,
                Name = tokenInfo.Name,
                Decimals = tokenInfo.Decimals,
                Circulation = tokenInfo.Circulation,
                Modified = tokenInfo.Modified
            };
            HcsTopic = hcsTopic;
            Title = rules.Title ?? tokenInfo.Symbol ?? tokenInfo.TokenId.ToString();
            Description = rules.Description ?? tokenInfo.Name ?? tokenInfo.TokenId.ToString();
            HcsStartDate = ComputeStartDateFilter(configuration);
            IneligibleAccounts = rules.IneligibleAccounts;
            BallotCreators = rules.BallotCreators;
            MinimumVotingThreshold = rules.MinimumVotingThreshold;
            MinimumVotingPeriod = rules.MinimumVotingPeriod;
            MinimumStandoffPeriod = rules.MinimumStandoffPeriod;
            _logger.LogInformation("Configuration Loaded");
            _logger.LogInformation("Title: {title}", Title);
            _logger.LogInformation("Description: {description}", Description);
            _logger.LogInformation("HCS Topic: {hcsTopic}", hcsTopic);
            _logger.LogInformation("Voting Token: {tokenId}", HcsToken.Id);
            if (HcsStartDate is null)
            {
                _logger.LogInformation("Starting Timestamp: none, replay entire stream.");
            }
            else
            {
                _logger.LogInformation("Starting Timestamp: {hcsStartDAte}", HcsStartDate.Value);
            }
            _logger.LogInformation("Ballot Creators: {creators}", BallotCreators.Length > 0 ? string.Join<Address>(", ", BallotCreators) : "any account may submit a proposal");
            _logger.LogInformation("Ineligible Accounts: {ineligible}", IneligibleAccounts.Length > 0 ? string.Join<Address>(", ", IneligibleAccounts) : "none, all accounts may vote");
            _logger.LogInformation("Minimum Voting Threshold: {threshold}", MinimumVotingThreshold);
            _logger.LogInformation("Minimum Voting Period (days): {period}", MinimumVotingPeriod);
            _logger.LogInformation("Minimum Standoff Period (days): {periods}", MinimumStandoffPeriod);
            _logger.LogInformation("GRPC Mirror Endpoint: {endpoint}", MirrorGrpc);
            _logger.LogInformation("REST Mirror Endpoint: {endpoint}", MirrorRest);
        }
        catch (VotingStreamException ex)
        {
            _logger.LogError(ex, "Loading Configuration from first message in HCS Stream Failed.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Loading Configuration from first message in HCS Stream Failed.");
            throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "Loading Configuration from first Message in stream failed.", ex);
        }
    }
    /// <summary>
    /// Helper function to retrieve the rules definition that lives at 
    /// message one of the hcs voting stream topic.
    /// </summary>
    /// <param name="client">
    /// Mirror Node rest client.
    /// </param>
    /// <param name="hcsTopic">
    /// The HCS Voting Stream topic ID.
    /// </param>
    /// <returns>
    /// A `RulesDefinition` object obtained from the payload of topic 
    /// stream’s first message.
    /// </returns>
    /// <exception cref="VotingStreamException">
    /// If there was an error retrieving the first message, such as it does not 
    /// exist, or if the payload does not conform to a rules definition message.
    /// </exception>
    private async Task<RulesDefinition> GetRulesAsync(MirrorRestClient client, Address hcsTopic)
    {
        _logger.LogInformation($"Retrieving rules configuration for hcs stream {hcsTopic}.");
        var firstMessage = await client.GetHcsMessageAsync(hcsTopic, 1);
        if (firstMessage == null)
        {
            throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "HCS Voting Stream does not contain the configuration message.");
        }
        if (string.IsNullOrWhiteSpace(firstMessage.Message))
        {
            throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "First message in topic does not appear to define the voting rules, it is empty.");
        }
        var rules = JsonSerializer.Deserialize<RulesDefinition>(Convert.FromBase64String(firstMessage.Message));
        if (!"define-rules".Equals(rules!.MessageType))
        {
            throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "First message in topic does not appear to define the voting rules.");
        }
        return rules;
    }
    /// <summary>
    /// Computes the starting date filter.  The environment may specify an 
    /// HCS_START_DATE environment variable instructing the server to skip 
    /// over some of the HCS history state.  Ballots created before this 
    /// timestamp will not visible to software relying on this service.
    /// </summary>
    /// <param name="configuration">
    /// A asp.net core configuration object, most likely obtained from 
    /// environmental variables.
    /// </param>
    /// <returns>
    /// The optional configured start date, or null if not configured.
    /// </returns>
    /// <exception cref="VotingStreamException">
    /// If there was a problem reading the date from the environment 
    /// or if it was invalid.
    /// </exception>
    private ConsensusTimeStamp? ComputeStartDateFilter(ConfigurationManager configuration)
    {
        var startDateAsString = configuration["HCS_START_DATE"];
        if (!string.IsNullOrWhiteSpace(startDateAsString))
        {
            if (decimal.TryParse(startDateAsString, out decimal epoch))
            {
                var startDate = new ConsensusTimeStamp(epoch);
                if (startDate > ConsensusTimeStamp.Now)
                {
                    throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "Invalid HCS Starting Date, value can not be in the future.");
                }
                return startDate;
            }
            throw new VotingStreamException(VotingStreamCode.InvalidConfiguration, "Invalid HCS Starting Date in configuration.");
        }
        return null;
    }
    /// <summary>
    /// Retrieves the version string of this server instance from the 
    /// underlying assembly information.
    /// </summary>
    /// <returns>
    /// A version string identifying the version of this running software.
    /// </returns>
    private static string GetVersionString()
    {
        var assembly = Assembly.GetExecutingAssembly();
        var attribute = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>();
        if (attribute != null)
        {
            return attribute.InformationalVersion;
        }
        return "Unknown";
    }
    /// <summary>
    /// Attempts to parse an Hedera Address ID from a given string.  
    /// If successful, return true.
    /// </summary>
    /// <param name="value">
    /// The string to aprse
    /// </param>
    /// <param name="address">
    /// Output variable containing the parsed address, if successsful.
    /// </param>
    /// <returns>
    /// True if the string was a valid address ID and was successfully parsed.
    /// </returns>
    private static bool TryParseAddress(string? value, out Address address)
    {
        if (!string.IsNullOrWhiteSpace(value))
        {
            var parts = value.Split('.');
            if (parts.Length == 3)
            {
                if (uint.TryParse(parts[0], out uint shard) &&
                    uint.TryParse(parts[1], out uint realm) &&
                    uint.TryParse(parts[2], out uint number))
                {
                    address = new Address(shard, realm, number);
                    return true;
                }
            }
        }
        address = Address.None;
        return false;
    }
}
