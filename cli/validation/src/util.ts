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
export function isAddressArrayOrUndefined(value: string[] | undefined): boolean {
    if (value) {
        if (!Array.isArray(value)) {
            return false;
        }
        for (let addr of value) {
            if (!isAddress(addr)) {
                return false;
            }
        }
    }
    return true;
}
export function isFractionOrUndefined(value: number | undefined): boolean {
    if (value === undefined) {
        return true;
    }
    if (Number.isNaN(value)) {
        return false;
    }
    if (value < 0 || value > 1) {
        return false;
    }
    return true;
}
export function isNonNegativeOrUndefined(value: number | undefined): boolean {
    if (value === undefined) {
        return true;
    }
    if (Number.isNaN(value)) {
        return false;
    }
    if (value < 0) {
        return false;
    }
    return true;
}
export function computeDiffInDays(startingTimestamp: string, endingTimestamp: string) {
    const startingSeconds = parseFloat(startingTimestamp);
    const endingSeconds = parseFloat(endingTimestamp);
    return (endingSeconds - startingSeconds) / 86400.0;
}
