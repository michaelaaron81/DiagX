import fs from 'fs';
import os from 'os';
import path from 'path';
// Default storage directory (per-user) - can be overridden by DIAGX_LOCAL_DIR env var (used in tests)
export function getLocalStoragePath() {
    const env = process.env.DIAGX_LOCAL_DIR;
    if (env && env.length)
        return env;
    const base = process.platform === 'win32' ? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming') : path.join(os.homedir(), '.config');
    return path.join(base, 'diagx-omen');
}
export function ensureStorage() {
    const dir = getLocalStoragePath();
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
}
export function storageFile() {
    return path.join(getLocalStoragePath(), 'pt-overrides.json');
}
export function readAllEntries() {
    try {
        const p = storageFile();
        if (!fs.existsSync(p))
            return {};
        const raw = fs.readFileSync(p, 'utf8');
        return JSON.parse(raw || '{}');
    }
    catch (err) {
        // fail safe: return empty
        return {};
    }
}
export function saveEntry(entry) {
    ensureStorage();
    const all = readAllEntries();
    all[entry.profileId] = entry;
    fs.writeFileSync(storageFile(), JSON.stringify(all, null, 2), 'utf8');
}
export function loadEntry(profileId) {
    const all = readAllEntries();
    return all[profileId] || null;
}
export function removeEntry(profileId) {
    const all = readAllEntries();
    if (!all[profileId])
        return false;
    delete all[profileId];
    fs.writeFileSync(storageFile(), JSON.stringify(all, null, 2), 'utf8');
    return true;
}
export function listEntries() {
    const all = readAllEntries();
    return Object.values(all);
}
export default { getLocalStoragePath, readAllEntries, saveEntry, loadEntry, removeEntry, listEntries };
