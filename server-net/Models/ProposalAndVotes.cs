#pragma warning disable CS8618
using Hashgraph;
using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using VotingStream.Mirror;

namespace VotingStream.Models;
/// <summary>
/// Stores the details of a proposal ballot and the votes cast.
/// </summary>
public class ProposalAndVotes : Proposal
{
    /// <summary>
    /// Dictionary of known votes cast.
    /// </summary>
    private ConcurrentDictionary<Address, Vote> _votes = new();
    /// <summary>
    /// Listing of the votes cast.
    /// </summary>
    [JsonPropertyName("votes")]
    public Vote[] Votes
    {
        get
        {
            return _votes.Values.OrderByDescending(v => v.TokenBalance).ThenByDescending(v => v.TimeStamp).ToArray();
        }
    }
    /// <summary>
    /// Updates the proposal’s list of votes with the new vote.  If the payer has 
    /// already voted, this vote will replace the previous vote, otherwise adds 
    /// the vote to the list of votes.
    /// </summary>
    /// <param name="account">
    /// Account (payer) that is voting.
    /// </param>
    /// <param name="choice">
    /// The vote’s choice.
    /// </param>
    /// <param name="balance">
    /// The account holder’s token balance (at the beginning of the voting window).
    /// </param>
    /// <param name="timestamp">
    /// The consensus timestamp of the vote.
    /// </param>
    public void RecordVote(Address account, int choice, long balance, ConsensusTimeStamp timestamp)
    {
        _votes.AddOrUpdate(account, _ =>
        {
            return new Vote
            {
                Payer = account,
                Choice = choice,
                TimeStamp = timestamp,
                TokenBalance = balance
            };
        }, (_, vote) =>
        {
            Tally[vote.Choice] = Tally[vote.Choice] - vote.TokenBalance;
            return new Vote
            {
                Payer = account,
                Choice = choice,
                TimeStamp = timestamp,
                TokenBalance = balance
            };
        });
        Tally[choice] = Tally[choice] + balance;
        Checksum = null;
    }
    /// <summary>
    /// Assuming all votes have been recorded and the window of
    /// voting has passed, computes the winner of the ballot and
    /// the corresponding checksum for inter-tool results validation.
    /// </summary>
    /// <param name="client">
    /// Mirror REST client providing lookup services necessary to
    /// calculate the circulation of voting token and potentially
    /// necessary quorum threshold values.
    /// </param>
    public async Task ComputeWinnerAndChecksumAsync(MirrorRestClient client)
    {
        long threshold = 0;
        if (MinVotingThreshold > 0)
        {
            var circulation = (await client.GetTokenInfo(TokenId, StartingTimeStamp))?.Circulation ?? 0;
            long ineligible = 0;
            foreach (var account in IneligibleAccounts)
            {
                var accountBalance = await client.GetTokenBalanceAsync(account, TokenId, StartingTimeStamp);
                if (accountBalance != null)
                {
                    ineligible += accountBalance.Balance;
                }
            }
            threshold = (long)Math.Ceiling(MinVotingThreshold * (decimal)(circulation - ineligible));
        }
        var winner = ComputeWinner(Tally, threshold);

        var data = new StringBuilder();
        data.Append(TimeStamp);
        data.Append($"|{threshold}");
        // Note: order by is necessary to get the checksum correct.        
        foreach (var vote in _votes.Values.OrderBy(v => v.Payer.ToString()))
        {
            data.Append($"|{vote.Payer}-{vote.Choice}-{vote.TokenBalance}");
        }
        for (int i = 0; i < Tally.Length; i++)
        {
            data.Append($"|{i}.{Tally[i]}");
        }
        data.Append($"|{winner}");
        if (winner > -1)
        {
            data.Append(':');
            data.Append(Choices[winner]);
        }
        Winner = winner;
        Checksum = Convert.ToHexString(MD5.Create().ComputeHash(Encoding.ASCII.GetBytes(data.ToString()))).ToLower();
    }
    /// <summary>
    /// Helper function computing the winner of a proposal.
    /// </summary>
    /// <param name="tally">
    /// The tally of votes, if more than two options, the
    /// last option is assumed to be the "abstain" vote,
    /// which counts for threhsold, but otherwise is not
    /// a "winnable" options.
    /// </param>
    /// <param name="threshold">
    /// The minimum required threshold that must be met
    /// in tiny token balance for the decision to be ratified.
    /// If not met, will return -2;
    /// </param>
    /// <returns>
    /// The winning choice if not a tie and quoroum has been met.
    /// If a tie, -1 is retuned, if quorum has not been met, then
    /// -2 is returned.
    /// </returns>
    private int ComputeWinner(long[] tally, long threshold)
    {
        var total = tally.Sum();
        if (total < threshold)
        {
            // voting balance threshold was not met.
            return -2;
        }
        // If more than 2 choices, assume last is Abstain
        var winner = 0;
        var list = tally.Length > 2 ? tally[..^1] : tally;
        for (var i = 1; i < list.Length; i++)
        {
            if (list[i] > list[winner])
            {
                winner = i;
            }
        }
        // Double check for any tie votes.
        if (list.Count(cast => cast == list[winner]) > 1)
        {
            winner = -1;
        }
        return winner;
    }
}
