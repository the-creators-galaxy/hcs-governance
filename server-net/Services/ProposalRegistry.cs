using Hashgraph;
using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using VotingStream.Models;

namespace VotingStream.Services;
/// <summary>
/// The stateful (in memory) storage of proposal ballots and their votes.
/// </summary>
public class ProposalRegistry
{
    /// <summary>
    /// The dictionary containing the list of known proposals.
    /// </summary>
    private readonly ConcurrentDictionary<ConsensusTimeStamp, ProposalAndVotes> _proposals;
    /// <summary>
    /// Constructor, does not require any external services.
    /// </summary>
    public ProposalRegistry()
    {
        _proposals = new();
    }
    /// <summary>
    /// Returns true if the repository knows of a proposal with the given id.
    /// </summary>
    /// <param name="consensusTimeStamp">
    /// The consensus timestamp (id) of the proposal.
    /// </param>
    /// <returns>
    /// True if the proposal exists, otherwise false.
    /// </returns>
    public bool HasProposal(ConsensusTimeStamp consensusTimeStamp)
    {
        return _proposals.ContainsKey(consensusTimeStamp);
    }
    /// <summary>
    /// Attempts to retrieve a proposal object with the given consensus 
    /// timestamp id.
    /// </summary>
    /// <param name="consensusTimeStamp">
    /// The consensus timestamp (id) of the proposal.
    /// </param>
    /// <param name="proposal">
    /// A reference to the proposal instance, if found.
    /// </param>
    /// <returns>
    /// True if a proposal with the given id was found, otherwise false.
    /// </returns>
    public bool TryGetProposal(ConsensusTimeStamp consensusTimeStamp, [NotNullWhen(true)] out ProposalAndVotes? proposal)
    {
        return _proposals.TryGetValue(consensusTimeStamp, out proposal);
    }
    /// <summary>
    /// Adds a new proposal to the registry.
    /// </summary>
    /// <param name="proposal">
    /// A reference to the proposal to add.
    /// </param>
    public void RecordProposal(ProposalAndVotes proposal)
    {
        _proposals[proposal.TimeStamp] = proposal;
    }
    /// <summary>
    /// Retrieves a list of proposals, sorted by ending timestamp, 
    /// with proposals currently open for voting appearing at beginning.
    /// </summary>
    /// <returns>
    /// Sorted list of proposal objects.
    /// </returns>
    public ProposalAndVotes[] GetProposals()
    {
        var now = ConsensusTimeStamp.Now;
        var result = _proposals.Values
            .OrderBy(p => p.StartingTimeStamp <= now && now <= p.EndingTimeStamp ? -1 : 1)
            .ThenBy(p => p.EndingTimeStamp)
            .ToArray();
        return result;
    }
}
