import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// set env var to a temporary dir for isolation
const tmp = path.join(os.tmpdir(), `diagx-test-${Date.now()}`);
process.env.DIAGX_LOCAL_DIR = tmp;

import { saveEntry, loadEntry, removeEntry, listEntries, PTEntry } from '../src/cli/localOverrides';

describe('localOverrides helpers', () => {
  beforeEach(() => {
    // ensure empty dir
    if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
  });
  afterEach(() => {
    if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('save/load works', () => {
    const entry: PTEntry = { profileId: 'p1', pt: [[0, 10], [50, 200]], description: 'test', savedAt: new Date().toISOString() };
    saveEntry(entry);
    const loaded = loadEntry('p1');
    expect(loaded).not.toBeNull();
    if (!loaded) {
      throw new Error('Expected a loaded PTEntry');
    }
    expect(loaded.profileId).toBe('p1');
    expect(Array.isArray(loaded.pt)).toBeTruthy();
  });

  it('list entries shows saved', () => {
    const e1: PTEntry = { profileId: 'alpha', pt: [[10,100]], savedAt: new Date().toISOString() };
    const e2: PTEntry = { profileId: 'beta', pt: [[20,200]], savedAt: new Date().toISOString() };
    saveEntry(e1); saveEntry(e2);
    const list = listEntries().map(l => l.profileId).sort();
    expect(list).toEqual(['alpha','beta']);
  });

  it('remove entry works and returns false for missing', () => {
    const e1: PTEntry = { profileId: 'z1', pt: [[10,100]], savedAt: new Date().toISOString() };
    saveEntry(e1);
    const ok = removeEntry('z1');
    expect(ok).toBeTruthy();
    expect(loadEntry('z1')).toBeNull();
    expect(removeEntry('z1')).toBeFalsy();
  });
});
