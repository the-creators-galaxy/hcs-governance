namespace VotingStreamServer.Services;
/// <summary>
/// Internal Log Provider that forwards log entries to the log cache.
/// </summary>
public class InternalLogger : ILogger
{
    /// <summary>
    /// The category name associated with this logger’s instance.
    /// </summary>
    private readonly string _categoryName;
    /// <summary>
    /// Reference to the cache that log entries are forwarded to.
    /// </summary>
    private readonly LogCache _logCache;
    /// <summary>
    /// Constructor, requires the category name and log cache.
    /// </summary>
    /// <param name="categoryName">
    /// The category name associated with this logger’s instance.
    /// </param>
    /// <param name="logCache">
    /// Reference to the cache that log entries are forwarded to.
    /// </param>
    public InternalLogger(string categoryName, LogCache logCache)
    {
        _categoryName = categoryName;
        _logCache = logCache;
    }
    /// <summary>
    /// Called by the asp.net framework when beginning a scope, not implemented in this logger.
    /// </summary>
    public IDisposable? BeginScope<TState>(TState state) where TState : notnull
    {
        return default!;
    }
    /// <summary>
    /// Flag indicating readiness, this logger is always enabled.
    /// </summary>
    /// <param name="logLevel">
    /// additional log level information
    /// </param>
    /// <returns>True, this logger is always enabled.</returns>
    public bool IsEnabled(LogLevel logLevel)
    {
        return true;
    }
    /// <summary>
    /// Accepts a log entry from server components and forwards them to the internal log cache.
    /// </summary>
    /// <typeparam name="TState">
    /// The type of state context, Not Used.
    /// </typeparam>
    /// <param name="logLevel">
    /// The level assigned to the log entry.
    /// </param>
    /// <param name="eventId">
    /// The event ID assigned to the log entry, not used.
    /// </param>
    /// <param name="state">
    /// The state context, not used.
    /// </param>
    /// <param name="exception">
    /// Exception information that may or not exist.
    /// </param>
    /// <param name="formatter">
    /// The method that generates the log message entry.
    /// </param>
    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        _logCache.Add(_categoryName, logLevel, formatter(state, exception));
    }
}
