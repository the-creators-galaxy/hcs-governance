using Hashgraph;
using VotingStream.Mirror;
using VotingStream.Services;

namespace VotingStream.Models
{
    /// <summary>
    /// A sequenced task for marking the ledger consensus timestamp at the 
    /// beginning of a message fetch loop.  If no messages are fetched, 
    /// we then know that we are at least up-to-date with the consensus timestamp 
    /// marked in this task and can safely execute any background tasks if required.
    /// </summary>
    public class MarkTimeStampTask : IOrderedProcessingTask
    {
        /// <summary>
        /// Consensus timestamp that has been marked.
        /// </summary>
        private readonly ConsensusTimeStamp _timestamp;
        /// <summary>
        /// Public accessor for the consensus timestamp that has been marked.
        /// </summary>
        public ConsensusTimeStamp TimeStamp => _timestamp;
        /// <summary>
        /// Creates the mark time stamp task.
        /// </summary>
        /// <param name="timestamp">
        /// Consensus timestamp that has been marked.
        /// </param>
        public MarkTimeStampTask(ConsensusTimeStamp timestamp)
        {
            _timestamp = timestamp;
        }
        /// <summary>
        /// Executed in proper order by the processing task.  Simply calls a 
        /// method on the clock to see if this timestamp is indeed the latest 
        /// ledger timestamp and updates the latest processed timestamp accordingly.
        /// </summary>
        /// <param name="config">
        /// not used
        /// </param>
        /// <param name="registry">
        /// not used
        /// </param>
        /// <param name="processor">
        /// not used
        /// </param>
        /// <param name="mirror">
        /// not used
        /// </param>
        /// <param name="clock">
        /// The system wide clock tracking the latest processed consensus timestamp.
        /// </param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public Task ExecuteAsync(VotingStreamConfiguration config, ProposalRegistry registry, TaskProcessor processor, MirrorRestClient mirror, Clock clock, ILogger logger)
        {
            clock.RecordLatestTransactionTimestamp(_timestamp);
            return Task.CompletedTask;
        }
    }
}
