import { EntityIdKeyString } from '@bugbytes/hapi-util';
/**
 * Represents the validation rules for this HCS Message Stream.
 * For a ballot or vote to be considered valid, it must conform
 * to the parameters set in this message.  Furthermore for these
 * rules to be considered valid they MUST be placed in the FIRST
 * message found in the message stream (message serial number one).
 */
export interface RulesDefinition {
	/**
	 * HCS Message Type descriminator, must be 'definition' for the
	 * system to recognize this as a Voting System definition message.
	 */
	type: 'define-rules';
	/**
	 * A short title describing this HCS voting stream.
	 */
	title: string;
	/**
	 * A short description of the purpose of this HCS voting stream.
	 */
	description: string;
	/**
	 * The ID of the Hedera Token that shall be used for determining
	 * voting weights.  Only ballots that use this token for weights
	 * will be injested by the system.
	 *
	 * If not defined, this HCS steam can host ballots and vote counts
	 * for multple tokens, each ballot must define which token shall
	 * be used for voting in its defnition.
	 *
	 * If specified, any ballot specifying a voting token that does
	 * not match this setting will be considered invalid by validators.
	 */
	tokenId: EntityIdKeyString | undefined;
	/**
	 * Optional default value for the minimum fraction of eligible balance
	 * that must participate in a vote for it to be considered valid.
	 * If the quorum is not met, the outcome of the vote for or against
	 * the proposal is considered invalid.
	 *
	 * If not specified, or zero, there is no minimum required by the
	 * rules of this DAO as a whole.  If specified, this is the minimum
	 * value that must be met be a proposal deifintion to be considered
	 * valid.
	 *
	 * Each proposal definition may, in turn, specify a higher threshold
	 * value than what is specified here, but may not specify a value
	 * lower than what is defined here.  If a proposal does not specify
	 * a threshold value in its definition, the value defined here will
	 * be used.
	 */
	minVotingThreshold: number | undefined;
	/**
	 * An array of crypto and/or contract accounts that are not allowed to
	 * participate in voting.  The proposals threshold will not consider
	 * their balances when computing quorom requirements.  The HCS
	 * protocol allows each proposal to define a a list of inelegible
	 * accounts in addition to what is defined here for each proposed ballot.
	 * The resulting list of inelegible accounts will be the union of
	 * the two lists.
	 */
	ineligibleAccounts: EntityIdKeyString[] | undefined;
	/**
	 * An optional list of contracts or accounts that are allowed to
	 * post ballot proposals into this stream.  If specified, only
	 * ballot proposal definitions posted by accounts in this list
	 * will be considered valid.  Validators must reject ballot
	 * proposals not created by one of these listed accounts (in
	 * other words, one of these accounts must be the payer of
	 * the transaction submitting the HCS create ballot message)
	 */
	ballotCreators: EntityIdKeyString[] | undefined;
	/**
	 * The minimum voting window allowed (in days) for a ballot
	 * proposal to be considered valid.  If not specified the
	 * creator of the ballot may specify any voting window as
	 * small or large as desired.
	 */
	minimumVotingPeriod: number | undefined;
	/**
	 * The minimum standoff for the beginning a voting window
	 * (in days) from the creation of a ballot.  If not specified
	 * a ballot window can open immediately upon creation of
	 * a proposal ballot, otherwise to be considered valid,
	 * the ballot's voting start period must be at least the
	 * specified abount of days after the creation of the ballot.
	 */
	minimumStandoffPeriod: number | undefined;
}
