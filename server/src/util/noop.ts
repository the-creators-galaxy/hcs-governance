/**
 * Empty no-operation function.
 *
 * @returns A resolved promise without performing any actions.
 */
export function noop(): Promise<void> {
	return Promise.resolve();
}
