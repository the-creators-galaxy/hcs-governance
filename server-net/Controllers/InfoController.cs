using Microsoft.AspNetCore.Mvc;
using VotingStream.Services;

namespace VotingStream.Controllers;
/// <summary>
/// Provides information regarding the general state 
/// and configuration of the voting stream.
/// </summary>
[ApiController]
[Route("api/v1/info")]
public partial class InfoController : ControllerBase
{
    /// <summary>
    /// System logger for this controller.
    /// </summary>
    private readonly ILogger<InfoController> _logger;
    /// <summary>
    /// System Configuration
    /// </summary>
    private readonly VotingStreamConfiguration _configuration;
    /// <summary>
    /// Controller constructor.
    /// </summary>
    /// <param name="configuration">
    /// System Configuration.
    /// </param>
    /// <param name="logger">
    /// System logger for this controller.
    /// </param>
    public InfoController(VotingStreamConfiguration configuration, ILogger<InfoController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }
    /// <summary>
    /// Returns general information about this Voting Stream instance.
    /// </summary>
    /// <response code="200">
    /// A JSON structure enumerating the current state of the cache 
    /// and known gossip node endpoints.
    /// </response>
    [HttpGet]
    [Produces("application/json")]
    public VotingStreamConfiguration Get()
    {
        return _configuration;
    }
}