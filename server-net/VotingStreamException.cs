namespace VotingStream;
/// <summary>
/// Voting stream exception.  This exception is automatically 
/// mapped to an RFC 7807 problem result by middleware.
/// </summary>
public class VotingStreamException : Exception
{
    /// <summary>
    /// Code identifying the type of problem that was encountered.
    /// </summary>
    public VotingStreamCode Code { get; private init; }
    /// <summary>
    /// Constructor, taking a code, description and optional underlying exception.
    /// </summary>
    /// <param name="code">
    /// The code identifying the type of problem that was encountered.
    /// </param>
    /// <param name="description">
    /// A short description of the problem providing more conext.
    /// </param>
    /// <param name="innerException">
    /// Optional exception in the event this exception is the result of 
    /// a different exception.
    /// </param>
    public VotingStreamException(VotingStreamCode code, string description, Exception? innerException = null) : base(description, innerException)
    {
        Code = code;
    }
}