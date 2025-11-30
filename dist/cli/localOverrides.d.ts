export type PTChart = Array<[number, number]>;
export interface PTEntry {
    profileId: string;
    pt: PTChart;
    description?: string;
    savedAt: string;
}
export declare function getLocalStoragePath(): string;
export declare function ensureStorage(): void;
export declare function storageFile(): string;
export declare function readAllEntries(): Record<string, PTEntry>;
export declare function saveEntry(entry: PTEntry): void;
export declare function loadEntry(profileId: string): PTEntry | null;
export declare function removeEntry(profileId: string): boolean;
export declare function listEntries(): PTEntry[];
declare const _default: {
    getLocalStoragePath: typeof getLocalStoragePath;
    readAllEntries: typeof readAllEntries;
    saveEntry: typeof saveEntry;
    loadEntry: typeof loadEntry;
    removeEntry: typeof removeEntry;
    listEntries: typeof listEntries;
};
export default _default;
