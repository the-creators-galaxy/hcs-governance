using Hashgraph;
using System.Threading.Channels;
using VotingStream.Mirror;
using VotingStream.Models;

namespace VotingStream.Services;
/// <summary>
/// The core message and background task processor.  Ensures HCS messages 
/// are processed in proper order and background tasks are inserted and 
/// processed at the appropriate time.
/// </summary>
public class TaskProcessor
{
    /// <summary>
    /// The consensus timestamp of the latest processed HCS message or 
    /// execution time of the latest processed background task.
    /// </summary>
    private ConsensusTimeStamp _lastProcessedTimeStamp;
    /// <summary>
    /// The queue of incoming HCS message tasks that must be processed in 
    /// consensus timestamp order.
    /// </summary>
    private readonly Channel<IOrderedProcessingTask> _syncProcessingTasks;
    /// <summary>
    /// A priority queue holding any necessary background tasks that are 
    /// awaiting a given consensus timestamp to be inserted/interleaved into 
    /// the ordered processing queue.
    /// </summary>
    private readonly PriorityQueue<IBackgroundProcessingTask, ConsensusTimeStamp> _asyncProcessingTasks;
    /// <summary>
    /// The global configuration of this app service.
    /// </summary>
    private readonly VotingStreamConfiguration _config;
    /// <summary>
    /// Reference to the Mirror node REST API Client.
    /// </summary>
    private readonly MirrorRestClient _mirror;
    /// <summary>
    /// Reference to the data repository holding stateful data regarding ballot 
    /// proposal and vote counts.
    /// </summary>
    private readonly ProposalRegistry _registry;
    /// <summary>
    /// The system wide clock tracking the latest processed consensus timestamp.
    /// </summary>
    private readonly Clock _clock;
    /// <summary>
    /// Reference to the system logger.
    /// </summary>
    private readonly ILogger<TaskProcessor> _logger;
    /// <summary>
    /// Constructor, requires references to various configuration information 
    /// and services.
    /// </summary>
    /// <param name="config">
    /// The global configuration of this app service.
    /// </param>
    /// <param name="mirror">
    /// Reference to the Mirror node REST API Client.
    /// </param>
    /// <param name="registry">
    /// Reference to the data repository holding stateful data regarding ballot 
    /// proposal and vote counts.
    /// </param>
    /// <param name="clock">
    /// The system wide clock tracking the latest processed consensus timestamp.
    /// </param>
    /// <param name="logger">
    /// Reference to the system logger.
    /// </param>
    public TaskProcessor(VotingStreamConfiguration config, MirrorRestClient mirror, ProposalRegistry registry, Clock clock, ILogger<TaskProcessor> logger)
    {
        _config = config;
        _mirror = mirror;
        _registry = registry;
        _clock = clock;
        _logger = logger;
        _lastProcessedTimeStamp = new ConsensusTimeStamp(0);
        _syncProcessingTasks = Channel.CreateBounded<IOrderedProcessingTask>(new BoundedChannelOptions(512)
        {
            SingleReader = true,
            SingleWriter = true,
        });
        _asyncProcessingTasks = new();
        Task.Run(ProcessTaskQueue);
    }
    /// <summary>
    /// Adds a task to the processor queue that is to be processed 
    /// first in first out.
    /// </summary>
    /// <param name="task">
    /// The object implementing the ordered processing task interface.
    /// </param>
    public ValueTask EnqueueOrderedTask(IOrderedProcessingTask task)
    {
        return _syncProcessingTasks.Writer.WriteAsync(task);
    }
    /// <summary>
    /// Adds a background task to the list of tasks that should be 
    /// executed at a given consensus time relative to processing the 
    /// ordered list of tasks.
    /// </summary>
    /// <param name="task">
    /// The object implementing the background processing task interface.
    /// </param>
    public void EnqueueBackgroundTask(IBackgroundProcessingTask task)
    {
        _asyncProcessingTasks.Enqueue(task, task.DesiredExecutionTimestamp);
        if (_asyncProcessingTasks.TryPeek(out _, out ConsensusTimeStamp timestamp))
        {
            _clock.RecordNextBackgroundTask(timestamp);
        }
    }
    /// <summary>
    /// The internal task processing loop, it is started during object 
    /// construction and runs the entirety of the object’s lifetime.
    /// </summary>
    private async Task ProcessTaskQueue()
    {
        var reader = _syncProcessingTasks.Reader;
        while (true)
        {
            if (_asyncProcessingTasks.TryPeek(out _, out ConsensusTimeStamp timestamp) && timestamp <= _lastProcessedTimeStamp)
            {
                try
                {
                    var task = _asyncProcessingTasks.Dequeue();
                    await task.ExecuteAsync(_mirror, _logger);
                    if (_asyncProcessingTasks.TryPeek(out _, out ConsensusTimeStamp nexTimestamp))
                    {
                        _clock.RecordNextBackgroundTask(nexTimestamp);
                    }
                    else
                    {
                        _clock.RecordNextBackgroundTask(ConsensusTimeStamp.MaxValue);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Background Processing Failed");
                }
            }
            else
            {
                try
                {
                    var task = await reader.ReadAsync();
                    await task.ExecuteAsync(_config, _registry, this, _mirror, _clock, _logger);
                    if (_lastProcessedTimeStamp < task.TimeStamp)
                    {
                        _lastProcessedTimeStamp = task.TimeStamp;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "HCS Message Queue Reader Failed to Process Message");
                }
            }
        }
    }
}
