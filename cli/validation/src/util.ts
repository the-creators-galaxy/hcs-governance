export function isTimestamp(value: string): boolean {
    return /^\d+\.\d+$/.test(value);
}
export function isAddress(value: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(value);
}
export function getCurrentTime(): string {
    const miliseconds = new Date().getTime();
    const seconds = Math.floor(miliseconds / 1000);
    const nanoseconds = (miliseconds % 1000) * 1000;
    return `${seconds}.${nanoseconds.toString().padStart(6, '0')}`;
}
