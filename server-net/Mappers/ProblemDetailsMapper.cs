using Microsoft.AspNetCore.Mvc;

namespace VotingStream.Mappers;
/// <summary>
/// ASP.NET middleware helper to convert voting stream exceptions into RFC 7807 responses.
/// </summary>
public static class ProblemDetailsMapper
{
    /// <summary>
    /// Method called by middleware to convert exception to problem details.
    /// </summary>
    /// <param name="votingStreamException">
    /// Exception to convert.
    /// </param>
    /// <returns>
    /// A Problem Details object representing the RFC 7807 information.
    /// </returns>
    public static ProblemDetails MapVotingStreamException(VotingStreamException votingStreamException)
    {
        return new ProblemDetails()
        {
            Title = votingStreamException.Code.ToString(),
            Detail = votingStreamException.Message,
            Status = votingStreamException.Code switch
            {
                VotingStreamCode.InvalidConfiguration => StatusCodes.Status503ServiceUnavailable,
                _ => StatusCodes.Status400BadRequest,
            }
        };
    }
    /// <summary>
    /// Method called by middleware to convert exception to problem details.
    /// </summary>
    /// <param name="formatException">
    /// Exception to convert.
    /// </param>
    /// <returns>
    /// A Problem Details object representing the RFC 7807 information.
    /// </returns>
    public static ProblemDetails MapFormatException(FormatException formatException)
    {
        return new ProblemDetails()
        {
            Title = "InvalidFormat",
            Detail = formatException.Message,
            Status = StatusCodes.Status400BadRequest
        };
    }
}
