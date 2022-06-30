import * as proto from '@hashgraph/proto';
import * as Long from 'long';
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
/**
 * Converts a HAPI epoch date string into a protobuf ITimestamp
 *
 * @param timestamp the string representation of the HAPI epic timestamp.
 *
 * @returns an ITimestamp, either that value represented by a valid timestamp,
 * or the 'null' equivalent.
 */
export function epochToTimestamp(timestamp: string): proto.proto.ITimestamp {
	if (timestamp) {
		const [secondsAsNumber, nanos] = timestamp.split('.').map((v) => parseInt(v, 10));
		const seconds = Long.fromNumber(secondsAsNumber);
		return { seconds, nanos };
	}
	return { seconds: null };
}
