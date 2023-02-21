using Hashgraph;
using Microsoft.AspNetCore.Mvc;
using VotingStream.Models;
using VotingStream.Services;

namespace VotingStream.Controllers;
/// <summary>
/// Provides information regarding the current state of proposals and 
/// votes found in the HCS voting stream.
/// </summary>
[ApiController]
[Route("api/v1/ballots")]
public partial class BallotsController : ControllerBase
{
    /// <summary>
    /// The registry of ballots and votes.
    /// </summary>
    private readonly ProposalRegistry _registry;
    /// <summary>
    /// Constructor, requires a reference to the registry.
    /// </summary>
    /// <param name="registry"></param>
    public BallotsController(ProposalRegistry registry)
    {
        _registry = registry;
    }
    /// <summary>
    /// Returns the list of known proposals.
    /// </summary>
    /// <returns>
    /// List of proposals.
    /// </returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Proposal>> Get()
    {
        return _registry.GetProposals().Cast<Proposal>().ToArray();
    }
    /// <summary>
    /// Returns the details of a proposal, including votes and tallies if available.
    /// </summary>
    /// <param name="id">
    /// ID of the proposal to retrieve.
    /// </param>
    /// <returns>
    /// The details of the proposal, including votes and tallies if available.
    /// </returns>
    [HttpGet("{id}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<ProposalAndVotes> GetProposal(string id)
    {
        if (decimal.TryParse(id, out decimal epoch))
        {
            if (_registry.TryGetProposal(new ConsensusTimeStamp(epoch), out ProposalAndVotes? proposal))
            {
                return Ok(proposal);
            }
        }
        return NotFound();
    }
}