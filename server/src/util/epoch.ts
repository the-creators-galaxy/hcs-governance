/**
 * Converts a JavaScript `Date` into Hedera epoch format (0000.0000).
 *
 * @param date the date value to convert.
 *
 * @returns A data value in hedera epoch format (0000.0000).
 */
export function epochFromDate(date: Date | undefined): string | undefined {
	if (date) {
		const miliseconds = date.getTime();
		const seconds = Math.floor(miliseconds / 1000);
		const nanoseconds = (miliseconds % 1000) * 1000;
		return `${seconds}.${nanoseconds}`;
	}
	return undefined;
}
