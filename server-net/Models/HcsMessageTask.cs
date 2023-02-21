using Hashgraph;
using VotingStream.Mirror;
using VotingStream.Services;
using VotingStreamServer.Models;
using static VotingStream.Services.Util;

namespace VotingStream.Models
{
    /// <summary>
    /// A task for processing the contents of an HCS message.
    /// </summary>
    public class HcsMessageTask : IOrderedProcessingTask
    {
        /// <summary>
        /// The HCS message to process.
        /// </summary>
        private readonly HcsMessage _hcsMessage;
        /// <summary>
        /// Exposes the HCS Message’s consensus timestamp.
        /// </summary>
        public ConsensusTimeStamp TimeStamp => _hcsMessage.TimeStamp;
        /// <summary>
        /// Constructor, requires a HCS Message instance.
        /// </summary>
        /// <param name="message">
        /// The HCS message to process.
        /// </param>
        public HcsMessageTask(HcsMessage message)
        {
            _hcsMessage = message;
        }
        /// <summary>
        /// Called by the task processor in proper consensus timestamp order.
        /// </summary>
        /// <param name="config">
        /// The configuration of this application service.  Includes the gRPC and 
        /// REST endpoints among other important derived configuration parameters.
        /// </param>
        /// <param name="registry">
        /// Reference to the data repository holding stateful data regarding ballot 
        /// proposal and vote counts.
        /// </param>
        /// <param name="processor">
        /// The service that processes tasks obtained by this service, in submitted 
        /// order.
        /// </param>
        /// <param name="mirror">
        /// Reference to the Mirror node REST API Client.
        /// </param>
        /// <param name="clock">
        /// The system wide clock tracking the latest processed consensus timestamp.
        /// </param>
        /// <param name="logger">
        /// Output logging client.
        /// </param>
        public async Task ExecuteAsync(VotingStreamConfiguration config, ProposalRegistry registry, TaskProcessor processor, MirrorRestClient mirror, Clock clock, ILogger logger)
        {
            if (_hcsMessage.ChunkInfo != null)
            {
                logger.LogTrace($"Message {_hcsMessage.SequenceNumber} has chunks, which are not supported.");
                return;
            }
            if (string.IsNullOrWhiteSpace(_hcsMessage.Message))
            {
                logger.LogTrace($"Message {_hcsMessage.SequenceNumber} has no content.");
                return;
            }
            if (!TryExtractBytesFromMessage(_hcsMessage, out byte[]? messageBytes))
            {
                logger.LogTrace($"Message {_hcsMessage.SequenceNumber} is not convertable from bytes to text (for JSON).");
                return;
            }
            if (!TryGetMessageType(messageBytes, out string messageType))
            {
                logger.LogTrace($"Message {_hcsMessage.SequenceNumber} is missing the message type identifier.");
                return;
            }
            switch (messageType)
            {
                case "create-ballot":
                    ProcessAsCreateBallotMessage();
                    break;
                case "cast-vote":
                    await ProcessAsCastVoteMessageAsync();
                    break;
                default:
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} is has unknown type {messageType}.");
                    break;
            }
            clock.RecordLastProcessedMessage(_hcsMessage);

            void ProcessAsCreateBallotMessage()
            {
                if (!TryDeserializeJson(messageBytes, out CreateProposalMessage? createProposal))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} does not contain a valid 'create-ballot' message.");
                    return;
                }
                if (createProposal.TokenId != config.HcsToken.Id)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: contains a create-ballot for a different payment token ID.");
                    return;
                }
                if (config.BallotCreators != null && config.BallotCreators.Length > 0 && !config.BallotCreators.Contains(_hcsMessage.Payer))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Payer ID is not on the allowed list.");
                    return;
                }
                if (string.IsNullOrWhiteSpace(createProposal.Title))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Empty title.");
                    return;
                }
                if (string.IsNullOrWhiteSpace(createProposal.Description))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Empty description url.");
                    return;
                }
                if (string.IsNullOrWhiteSpace(createProposal.Discussion))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Empty discussion url.");
                    return;
                }
                if (!"single-choice".Equals(createProposal.Scheme))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Unrecognized Voting Scheme.");
                    return;
                }
                if (createProposal.Choices == null || createProposal.Choices.Length < 2)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Ballot needs at least two Voting Choices.");
                    return;
                }
                if (createProposal.StartTimestamp >= createProposal.EndTimestamp)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Voting ending time preceeds starting.");
                    return;
                }
                if (config.MinimumVotingPeriod > 0 && (createProposal.EndTimestamp - createProposal.StartTimestamp) < decimal.Multiply(config.MinimumVotingPeriod, 86400m))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Voting ending time does not permit required voting windo of {config.MinimumVotingPeriod} days.");
                    return;
                }
                if (_hcsMessage.TimeStamp > createProposal.StartTimestamp)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Proposal Voting Starting Time preceeds Proposal Creation Time.");
                    return;
                }
                if (config.MinimumStandoffPeriod > 0 && (createProposal.StartTimestamp - _hcsMessage.TimeStamp) < decimal.Multiply(config.MinimumStandoffPeriod, 86400m))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Voting starting time is less than {config.MinimumStandoffPeriod} days from ballot creation.");
                    return;
                }
                if (createProposal.RequiredThreshold.HasValue)
                {
                    if (createProposal.RequiredThreshold.Value < 0 || createProposal.RequiredThreshold.Value > 1)
                    {
                        logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Invalid Minimum Voting Threshold, must be a fraction between 0 and 1.0 inclusive.");
                        return;
                    }
                    if (config.MinimumVotingThreshold > 0 && createProposal.RequiredThreshold.Value < config.MinimumVotingThreshold)
                    {
                        logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Invalid Minimum Voting Threshold, must be equal to or greater than global configuration of {config.MinimumVotingThreshold}.");
                        return;
                    }
                }
                if (registry.HasProposal(_hcsMessage.TimeStamp))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed create-ballot validation: Ballot with same consensus timestamp already exists.");
                    return;
                }
                var proposal = new ProposalAndVotes
                {
                    TimeStamp = _hcsMessage.TimeStamp,
                    TokenId = createProposal.TokenId,
                    PayerId = _hcsMessage.Payer,
                    Title = createProposal.Title,
                    Description = createProposal.Description,
                    Discussion = createProposal.Discussion,
                    Scheme = createProposal.Scheme,
                    Choices = createProposal.Choices,
                    StartingTimeStamp = createProposal.StartTimestamp,
                    EndingTimeStamp = createProposal.EndTimestamp,
                    MinVotingThreshold = createProposal.RequiredThreshold ?? config.MinimumVotingThreshold,
                    IneligibleAccounts = (createProposal.IneligibleAccounts).Union(config.IneligibleAccounts).ToArray()

                };
                registry.RecordProposal(proposal);
                processor.EnqueueBackgroundTask(new ComputeChecksumTask(proposal));
                logger.LogTrace($"Message {_hcsMessage.SequenceNumber} added Proposal {_hcsMessage.TimeStamp} to list.");
            }
            async Task ProcessAsCastVoteMessageAsync()
            {
                if (!TryDeserializeJson(messageBytes, out CastVoteMessage? castVote))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: not a valid 'cast-vote' message.");
                    return;
                }
                if (!castVote.Choice.HasValue || castVote.Choice.Value < 0)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: Vote must be a non-negative number.");
                    return;
                }
                if (!registry.TryGetProposal(castVote.ProposalId, out ProposalAndVotes? proposal))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: Valid proposal does not exist.");
                    return;
                }
                if (proposal.StartingTimeStamp > _hcsMessage.TimeStamp)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: Vote was cast before voting started.");
                    return;
                }
                if (proposal.EndingTimeStamp < _hcsMessage.TimeStamp)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: Vote was cast after voting was finished.");
                    return;
                }
                if (proposal.Choices.Length <= castVote.Choice.Value)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: Vote did not match any valid vote option.");
                    return;
                }
                if (proposal.IneligibleAccounts.Contains(_hcsMessage.Payer))
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: Vote was cast by ineligible account.");
                    return;
                }
                var snapshot = await mirror.GetTokenBalanceAsync(_hcsMessage.Payer, proposal.TokenId, proposal.StartingTimeStamp);
                if (snapshot is null || snapshot.Balance == 0)
                {
                    logger.LogTrace($"Message {_hcsMessage.SequenceNumber} failed vote validation: Account has no voting token balance as of {proposal.StartingTimeStamp}");
                    return;
                }
                proposal.RecordVote(_hcsMessage.Payer, castVote.Choice.Value, snapshot.Balance, _hcsMessage.TimeStamp);
                logger.LogTrace($"Message {_hcsMessage.SequenceNumber} recorded as vote for proposal {proposal.TimeStamp} cast by {_hcsMessage.Payer}");
            }
        }
    }
}
