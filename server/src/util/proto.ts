import { ITopicID } from '@hashgraph/proto';
import * as Long from 'long';
/**
 * Constructs an `@hedera/protobuf` from the 0.0.123 format.
 *
 * @param value the topic id in 0.0.123 string format.
 *
 * @returns an `ITopicID` object representing the specified address.
 */
export function topicIdFromString(value: string): ITopicID {
	if (/^\d+\.\d+\.\d+$/.test(value)) {
		const parts = value.split('.');
		return {
			shardNum: Long.fromString(parts[0]),
			realmNum: Long.fromString(parts[1]),
			topicNum: Long.fromString(parts[2]),
		};
	}
	throw Error('Invalid Topic ID');
}
