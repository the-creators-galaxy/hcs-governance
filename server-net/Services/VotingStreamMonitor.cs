using Hashgraph;
using System.Threading.Channels;
using VotingStream.Mirror;
using VotingStream.Models;

namespace VotingStream.Services;
/// <summary>
/// The internal service responsible for monitoring the mirror node gRPC 
/// stream and REST api endpoints for new ballots and votes flowing from 
/// the configured HCS voting stream.
/// </summary>
public class VotingStreamMonitor
{
    /// <summary>
    /// The last known HCS stream sequence number sent to the monitor from 
    /// the gRPC stream.  The system will query the REST API endpoint until 
    /// it retrieves the necessary additional details for this HCS message.
    /// </summary>
    private ulong _latestKnownSequenceNumber;
    /// <summary>
    /// The last known HCS message fetched from the REST API endpoint.  This 
    /// is tracked separately from the last known sequence number due to 
    /// latency between the gRPC stream and the data updated behind the REST 
    /// API endpoint.
    /// </summary>
    private ulong _latestFetchedSequenceNumber;
    /// <summary>
    /// A flag that is set when the service observes that the gRPC endpoint 
    /// has fallen behind in sequence numbers relative to what is being 
    /// produced by the REST API endpoint.  If it falls too far behind, the 
    /// system will reset the gRPC stream to “catch up”.
    /// </summary>
    private bool _grpcIsBehind;
    /// <summary>
    /// The consensus timestamp matching the latest HCS message fetched from 
    /// the REST API endpoint, useful if it is necessary to reset the gRPC 
    /// stream.
    /// </summary>
    private ConsensusTimeStamp _latestFetchedMessageTimeStamp;
    /// <summary>
    /// Service for sharing the latest processed consensus timestamp for 
    /// HCS messages.
    /// </summary>
    private readonly Clock _clock;
    /// <summary>
    /// Client accessing the Mirror Node REST API.
    /// </summary>
    private readonly MirrorRestClient _mirror;
    /// <summary>
    /// The configuration of this application service.  Includes the gRPC and 
    /// REST endpoints among other important derived configuration parameters.
    /// </summary>
    private readonly VotingStreamConfiguration _config;
    /// <summary>
    /// The service that processes tasks obtained by this service, in submitted 
    /// order.
    /// </summary>
    private readonly TaskProcessor _processor;
    /// <summary>
    /// Output logging client.
    /// </summary>
    private readonly ILogger<VotingStreamMonitor> _logger;
    /// <summary>
    /// The currently running REST Fetch Task, when not null there is a thread 
    /// actively running a fetch loop.
    /// </summary>
    private Task? _fetchTask = null;
    /// <summary>
    /// The currently running gRPC stream receiving task, when not null there 
    /// is a thread actively listening for notifications from the Mirror Node 
    /// message stream.
    /// </summary>
    private Task? _listenTask = null;
    /// <summary>
    /// Constructor, relies on multiple services.
    /// </summary>
    /// <param name="clock">
    /// Service for sharing the latest processed consensus timestamp for 
    /// HCS messages.
    /// </param>
    /// <param name="mirror">
    /// <summary>
    /// Client accessing the Mirror Node REST API.
    /// </summary>
    /// </param>
    /// <param name="config">
    /// The configuration of this application service.  Includes the gRPC and 
    /// REST endpoints among other important derived configuration parameters.
    /// </param>
    /// <param name="processor">
    /// The service that processes tasks obtained by this service, in submitted 
    /// order.
    /// </param>
    /// <param name="logger">
    /// Output logging client.
    /// </param>
    public VotingStreamMonitor(Clock clock, MirrorRestClient mirror, VotingStreamConfiguration config, TaskProcessor processor, ILogger<VotingStreamMonitor> logger)
    {
        _clock = clock;
        _mirror = mirror;
        _config = config;
        _processor = processor;
        _logger = logger;
        _latestFetchedMessageTimeStamp = config.HcsStartDate ?? new ConsensusTimeStamp(0);
        _latestFetchedSequenceNumber = 1;
        _latestKnownSequenceNumber = 1;
        _grpcIsBehind = false;
    }
    /// <summary>
    /// Initializes the monitoring process.  Must be called during main program 
    /// startup after the global service is configured and dependencies have 
    /// been mapped. 
    /// </summary>
    public void Start()
    {
        _ = Task.Run(async () =>
        {
            if (_config.HcsStartDate is not null)
            {
                _logger.LogInformation($"Finding Message Sequence Number corresponding to starting timestamp {_config.HcsStartDate}.");
                var message = await _mirror.GetLatestHcsMessagePriorToTimestampAsync(_config.HcsTopic, _config.HcsStartDate.Value);
                if (message is not null)
                {
                    _latestFetchedSequenceNumber = message.SequenceNumber;
                }
                _logger.LogInformation($"Skipping HCS Messages prior to Sequence Number {_latestFetchedSequenceNumber}");
            }
            _logger.LogInformation("Starting Initial Sync with HCS Voting Stream.");
            StartFetchIteration();
            var task = _fetchTask;
            if (task != null)
            {
                await task;
                await Task.Delay(5000);
            }
            _logger.LogInformation("Initial Sync with HCS Voting Stream Complete, Starting Watchers.");
            StartGrpcListener();
        });
    }
    /// <summary>
    /// Starts the HCS Message Stream monitoring loop.
    /// </summary>
    private void StartGrpcListener()
    {
        if (_listenTask == null)
        {
            if (_grpcIsBehind)
            {
                _logger.LogWarning("Reconnecting to Mirror gRPC Node, which was behind.");
            }
            else
            {
                _logger.LogTrace("Connecting to Mirror gRPC Node");
            }
            _listenTask = Task.Run(ListenForGrpcMessagesAsync);
        }
    }
    /// <summary>
    /// Runs the gRPC stream monitoring loop.  The happy case for this method 
    /// is to be started once and run for the entirety of the program lifetime, 
    /// however if disconnections occur, or the stream falls behind what is 
    /// identified in the REST API stream, it will be stopped by the system 
    /// and restarted.
    /// </summary>
    private async Task ListenForGrpcMessagesAsync()
    {
        try
        {
            using var cts = new CancellationTokenSource();
            var channel = Channel.CreateBounded<TopicMessage>(new BoundedChannelOptions(1)
            {
                SingleReader = true,
                SingleWriter = true,
                FullMode = BoundedChannelFullMode.DropOldest
            });
            var reader = channel.Reader;
            var writer = channel.Writer;
            var readTask = Task.Run(async () =>
            {
                try
                {
                    while (await reader.WaitToReadAsync())
                    {
                        if (reader.TryRead(out TopicMessage? message))
                        {
                            if (message.SequenceNumber > _latestKnownSequenceNumber)
                            {
                                _latestKnownSequenceNumber = message.SequenceNumber;
                                _logger.LogTrace($"Received Notice of Message Sequence Number {message.SequenceNumber}");
                                StartFetchIteration();
                                if (_grpcIsBehind)
                                {
                                    _grpcIsBehind = false;
                                    _logger.LogWarning("gRPC HCS Message stream appears to have caught up with the Mirror REST Service.");
                                }
                            }
                            else if (message.SequenceNumber < _latestFetchedSequenceNumber && !_grpcIsBehind)
                            {
                                _grpcIsBehind = true;
                                _logger.LogWarning("gRPC HCS Message stream appears to be falling behind Mirror REST Service.");
                            }
                            else if (message.SequenceNumber + 100ul < _latestFetchedSequenceNumber && !cts.IsCancellationRequested)
                            {
                                writer.TryComplete();
                                cts.Cancel();
                                _logger.LogWarning("gRPC HCS Message stream appears to too far behind, will restart.");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    writer.TryComplete(ex);
                    cts.Cancel();
                }
            });
            await using var mirror = new MirrorClient(ctx => ctx.Uri = new Uri(_config.MirrorGrpc));
            await mirror.SubscribeTopicAsync(new SubscribeTopicParams
            {
                Topic = _config.HcsTopic,
                Starting = _latestFetchedMessageTimeStamp,
                CancellationToken = cts.Token,
                MessageWriter = writer
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "gRPC Message Stream Listener Failed");
        }
        finally
        {
            _listenTask = null;
        }
        _ = Task.Run(async () =>
        {
            await Task.Delay(1000);
            StartGrpcListener();
        });
    }
    /// <summary>
    /// Starts a REST Endpoint monitoring loop.
    /// </summary>
    private void StartFetchIteration()
    {
        if (_fetchTask == null)
        {
            _fetchTask = Task.Run(FetchPendingMessagesAsync);
        }
    }
    /// <summary>
    /// Runs a REST Endpoint monitoring loop.  This loop runs only as long as 
    /// is necessary to retrieve all not-yet processed HCS Messages for the 
    /// specified topic.  It is started frequently, either by timer or by 
    /// notification from the gRPC stream that a new topic is available.
    /// </summary>
    private async Task FetchPendingMessagesAsync()
    {
        try
        {
            var timestampMark = await _mirror.GetLatestTransactionTimestampAsync();
            while (true)
            {
                await foreach (var message in _mirror.GetHcsMessagesAsync(_config.HcsTopic, _latestFetchedSequenceNumber))
                {
                    _latestFetchedSequenceNumber = message.SequenceNumber;
                    _latestFetchedMessageTimeStamp = message.TimeStamp;
                    await _processor.EnqueueOrderedTask(new HcsMessageTask(message));
                }
                if (_latestKnownSequenceNumber > _latestFetchedSequenceNumber)
                {
                    await Task.Delay(500);
                    continue;
                }
                else if (_latestKnownSequenceNumber < _latestFetchedSequenceNumber)
                {
                    _latestKnownSequenceNumber = _latestFetchedSequenceNumber;
                }
                break;
            }
            await _processor.EnqueueOrderedTask(new MarkTimeStampTask(timestampMark));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fetch Message Loop Failed with Unexpected Error, Restarting ...");
        }
        finally
        {
            _fetchTask = null;
        }
        _ = Task.Run(async () =>
        {
            // Longest delay between polling is 60 seconds or when the next scheduled
            // background task is due.  The mirror grpc listener can kick this method
            // before that if it receives a message on the topic stream.  But if that
            // does not happen, we'll poll on this rate.  That way if we have gRPC
            // mirror node issues, we can still update state albeit with degraded peformance.
            // Also, The max polling is reduced if we're aware the gRPC stream is behind
            // the rest service
            await Task.Delay((int)(Math.Max(1, Math.Min(_grpcIsBehind ? 5 : 60, _clock.NextBackgroundProcessTimeStamp - ConsensusTimeStamp.Now)) * 1000));
            StartFetchIteration();
        });
    }
}
