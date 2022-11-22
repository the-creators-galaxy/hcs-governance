import { EntityIdKeyString, TimestampKeyString } from '@bugbytes/hapi-util';

/**
 * Represents details of the voting token attached to this
 * server instance.  Note: it is a class not an interface,
 * this is necessary because this information is injected
 * by the NestJS framework (interfaces can not be injected).
 */
export class TokenSummary {
	/**
	 * The hedera token used for voting,
	 * in 0.0.123 string format.
	 */
	id: EntityIdKeyString;
	/**
	 * The symbol associated with the voting token.
	 */
	symbol: string;
	/**
	 * The name associated with the voting token.
	 */
	name: string;
	/**
	 * The unit decimals associated with this token, primarily
	 * used for display purposes, all calculations are performed
	 * using the smallest unit of token measurement in whole numbers.
	 */
	decimals: number;
	/**
	 * The current total circulation of token on the ledger, in
	 * smallest denomination, at the point in time denoted on the
	 * timestamp.
	 */
	circulation: number;
	/**
	 * The consensus timestamp at which the information in this
	 * record is valid (for example, some tokens can change their
	 * circulation over time, it may be important to know the time
	 * at which the circulation information was obtained.)
	 */
	modified: TimestampKeyString;
}
