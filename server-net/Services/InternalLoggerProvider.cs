using System.Collections.Concurrent;
using System.Runtime.Versioning;

namespace VotingStreamServer.Services;
/// <summary>
/// Internal Logger provider factory.
/// </summary>
[UnsupportedOSPlatform("browser")]
[ProviderAlias("InternalLogger")]
public class InternalLoggerProvider : ILoggerProvider
{
    /// <summary>
    /// The list of loggers, keyed by category type.
    /// </summary>
    private readonly ConcurrentDictionary<string, InternalLogger> _loggers = new(StringComparer.OrdinalIgnoreCase);
    /// <summary>
    /// Reference to the log cache that each logger must be provided.
    /// </summary>
    private readonly LogCache _logCache;
    /// <summary>
    /// Constructor, requires a reference to the log cache.
    /// </summary>
    /// <param name="logCache">
    /// Reference to the log cache, needed when creating new internal logger instances.
    /// </param>
    public InternalLoggerProvider(LogCache logCache)
    {
        _logCache = logCache;
    }
    /// <summary>
    /// Called by the middleware when a logger for a certain category is needed.
    /// </summary>
    /// <param name="categoryName">
    /// The category name to associate with this logger instance.
    /// </param>
    /// <returns>
    /// A new (or cached) instance of an internal logger with the assigned category name.
    /// </returns>
    public ILogger CreateLogger(string categoryName)
    {
        return _loggers.GetOrAdd(categoryName, name => new InternalLogger(name, _logCache));
    }
    /// <summary>
    /// Called by the middleware during process tear-down.
    /// </summary>
    public void Dispose()
    {
        _loggers.Clear();
    }
}
