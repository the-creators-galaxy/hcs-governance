import { date_to_keyString } from "@bugbytes/hapi-util";

/**
 * Converts an Hedera Epoch Date String into a JavaScript date.
 *
 * @param epoch date string
 *
 * @returns the converted Java Script date object.
 */
export function dateFromEpoch(epoch: string): Date {
  return new Date(parseFloat(epoch) * 1000);
}
/**
 * Converts a given JavaScript date to an Hedera Epoch String with
 * the additional rolling time forward to the next UTC midnight.
 *
 * @param date JavaScript date.
 *
 * @returns epoch date string rolled forward to the next UTC midnight
 * of the original date.
 */
export function ceilingEpochFromDate(
  date: Date | undefined
): string | undefined {
  if (date) {
    const ceiling = new Date(date);
    ceiling.setDate(ceiling.getDate() + 1);
    ceiling.setUTCHours(0, 0, 0, 0);
    return date_to_keyString(ceiling);
  }
  return undefined;
}
/**
 * Converts a given JavaScript date to an Hedera Epoch String with
 * the additional rolling back of time to UTC midnight.
 *
 * @param date JavaScript date.
 *
 * @returns epoch date string rolled back to UTC midnight for the
 * original date.
 */
export function floorOrStandoffEpochFromDate(date: Date | undefined, standoff: number): string | undefined {
  const earliest = new Date();
  earliest.setTime(earliest.getTime() + 300000 + standoff * 86400000);  
  if (date) {
    const floor = new Date(date);
    floor.setUTCHours(0, 0, 0, 0);
    if(earliest.getTime() < floor.getTime()) {
      return date_to_keyString(floor);
    }
  }
  return date_to_keyString(earliest);;
}
