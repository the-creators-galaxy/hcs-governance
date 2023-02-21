using Hashgraph;
using VotingStream.Mirror;
using VotingStream.Services;

namespace VotingStream.Models;
/// <summary>
/// The ordered process task interface.
/// </summary>
public interface IOrderedProcessingTask
{
    /// <summary>
    /// The consensus timestamp linked to this task.
    /// </summary>
    ConsensusTimeStamp TimeStamp { get; }
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
    Task ExecuteAsync(VotingStreamConfiguration config, ProposalRegistry registry, TaskProcessor processor, MirrorRestClient mirror, Clock clock, ILogger logger);
}
