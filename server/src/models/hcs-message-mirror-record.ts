/**
 * Interface representing a raw HCS message sent from the mirror
 * node GRP streaming service.
 */
export interface HcsMessageMirrorRecord {
	/**
	 * Message’s chunk info, not supported by this system, messages
	 * with chunk info will be considered invalid.
	 */
	chunk_info: null;
	/**
	 * The date and time this message was posted,
	 * in hedera 0000.0000 epoch string format.
	 */
	consensus_timestamp: string;
	/**
	 * The payload of the message (ballot or vote
	 * information, encoded in ASCII/JSON)
	 */
	message: string;
	/**
	 * The hedera account that submitted the message,
	 * in 0.0.123 string format.
	 */
	payer_account_id: string;
	/**
	 * The HCS running hash for this message instance.
	 */
	running_hash: string;
	/**
	 * The HCS running hash version for this message instance.
	 */
	running_hash_version: number;
	/**
	 * The sequence order of this message, unique for the
	 * whole HCS topic.
	 */
	sequence_number: number;
	/**
	 * The topic identifier this message was sent to,
	 * in 0.0.123 string format.
	 */
	topic_id: string;
}
