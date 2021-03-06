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
    return epochFromDate(ceiling);
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
export function floorEpochFromDate(date: Date | undefined): string | undefined {
  if (date) {
    const floor = new Date(date);
    floor.setUTCHours(0, 0, 0, 0);
    return epochFromDate(floor);
  }
  return undefined;
}
/**
 * Converts a given JavaScript date to an Hedera Epoch Date String.
 *
 * @param date JavaScript date.
 *
 * @returns epoch date string.
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
