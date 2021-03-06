/**
 * Represents details of the voting token attached to this
 * server instance.  Note: it is a class not an interface,
 * this is necessary because this information is injected
 * by the NestJS framework (interfaces can not be injected).
 */
export class TokenInfo {
	/**
	 * The hedera token used for voting,
	 * in 0.0.123 string format.
	 */
	id: string;
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
}
