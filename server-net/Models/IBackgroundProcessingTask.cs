using Hashgraph;
using VotingStream.Mirror;

namespace VotingStream.Models;
/// <summary>
/// The common background processing task interface.
/// </summary>
public interface IBackgroundProcessingTask
{
    /// <summary>
    /// The consensus timestamp at which the task should be executed 
    /// (inserted into the sequenced processing stream).
    /// </summary>
    ConsensusTimeStamp DesiredExecutionTimestamp { get; }
    /// <summary>
    /// Called by the task processor in proper consensus timestamp order.
    /// </summary>
    /// <param name="mirror">
    /// Reference to the Mirror node REST API Client.
    /// </param>
    /// <param name="logger">
    /// Output logging client.
    /// </param>
    Task ExecuteAsync(MirrorRestClient mirror, ILogger logger);
}
