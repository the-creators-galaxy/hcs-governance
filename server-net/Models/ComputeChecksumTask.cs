using Hashgraph;
using VotingStream.Mirror;
using VotingStream.Models;

namespace VotingStreamServer.Models
{
    /// <summary>
    /// Task for tallying proposal votes and computing the validating checksum.
    /// </summary>
    public class ComputeChecksumTask : IBackgroundProcessingTask
    {
        /// <summary>
        /// The proposal object containing the list of votes to validate.
        /// </summary>
        private readonly ProposalAndVotes _proposal;
        /// <summary>
        /// The timestamp at which this background task should be executed 
        /// (just after the voting end timestamp of the ballot). 
        /// </summary>
        public ConsensusTimeStamp DesiredExecutionTimestamp => _proposal.EndingTimeStamp;
        /// <summary>
        /// Constructor, requires a proposal.
        /// </summary>
        /// <param name="proposal">
        /// Proposal to compute the vote tally and checksum from.</param>
        public ComputeChecksumTask(ProposalAndVotes proposal)
        {
            _proposal = proposal;
        }
        /// <summary>
        /// Called by the task processor in proper consensus timestamp order.
        /// </summary>
        /// <param name="mirror">
        /// Reference to the Mirror node REST API Client.
        /// </param>
        /// <param name="logger">
        /// Output logging client.
        /// </param>
        public async Task ExecuteAsync(MirrorRestClient mirror, ILogger logger)
        {
            await _proposal.ComputeWinnerAndChecksumAsync(mirror);
            logger.LogInformation($"Proposal {_proposal.TimeStamp} result computed as {_proposal.Winner} with checksum {_proposal.Checksum}.");
        }
    }
}
