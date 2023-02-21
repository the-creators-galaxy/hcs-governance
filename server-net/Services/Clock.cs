using Hashgraph;

namespace VotingStream.Services;
/// <summary>
/// The system wide clock tracking the latest processed consensus timestamp.
/// </summary>
public class Clock
{
    /// <summary>
    /// The consensus timestamp of the latest processed HCS voting stream message.
    /// </summary>
    private ConsensusTimeStamp _latestProcessedTimeStamp = new ConsensusTimeStamp(0);
    /// <summary>
    /// The next known consensus time stamp at which the next awaiting background 
    /// process should be executed.
    /// </summary>
    private ConsensusTimeStamp _nextBackgroundProcessTimeStamp = ConsensusTimeStamp.MaxValue;
    /// <summary>
    /// The consensus timestamp of the latest processed HCS voting stream message.
    /// </summary>
    public ConsensusTimeStamp LatestProcessedTimeStamp => _latestProcessedTimeStamp;
    /// The next known consensus time stamp at which the next awaiting background 
    /// process should be executed.
    public ConsensusTimeStamp NextBackgroundProcessTimeStamp => _nextBackgroundProcessTimeStamp;
    /// <summary>
    /// Records the latest processed HCS Voting Stream message consensus timestamp.
    /// </summary>
    /// <param name="message">
    /// The HCS message that was just processed.
    /// </param>
    internal void RecordLastProcessedMessage(Mirror.HcsMessage message)
    {
        _latestProcessedTimeStamp = message.TimeStamp;
    }
    /// <summary>
    /// Marks the latest known ledger wide consensus time stamp from the latest 
    /// transaction in the ledger, due to potential race conditions in the HCS 
    /// Message retrieval loop, this may be out-of-sync with the latest processed 
    /// HCS message, in which case this value is ignored.
    /// </summary>
    /// <param name="latestTransactionTimestamp">
    /// Last known transaction consensus timestamp from the ledger.
    /// </param>
    internal void RecordLatestTransactionTimestamp(ConsensusTimeStamp latestTransactionTimestamp)
    {
        if (latestTransactionTimestamp > _latestProcessedTimeStamp)
        {
            _latestProcessedTimeStamp = latestTransactionTimestamp;
        }
    }
    /// <summary>
    /// Marks the next consensus timestamp that a background task should be executed.
    /// </summary>
    /// <param name="nextBackgroundTask">
    /// The background task’s starting consensus timesamp.
    /// </param>
    internal void RecordNextBackgroundTask(ConsensusTimeStamp nextBackgroundTask)
    {
        _nextBackgroundProcessTimeStamp = nextBackgroundTask;
    }
}
