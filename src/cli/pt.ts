#!/usr/bin/env ts-node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { saveEntry, loadEntry, listEntries, removeEntry, PTEntry } from './localOverrides';

program.name('diagx-pt').description('Manage local, ephemeral PT override tables (stored locally, not in repo)');

program.command('import')
  .argument('<profileId>', 'profile ID to attach this manual PT table to')
  .argument('<ptFile>', 'path to JSON file containing PT chart - array of [tempF, pressurePSIG]')
  .option('-d, --description <text>', 'optional description for this entry')
  .action((profileId: string, ptFile: string, opts: any) => {
    if (!fs.existsSync(ptFile)) { console.error('pt file not found:', ptFile); process.exit(2); }
    const raw = fs.readFileSync(ptFile, 'utf8');
    let pt: any;
    try { pt = JSON.parse(raw); } catch (e) { console.error('invalid json'); process.exit(3); }
    const entry: PTEntry = { profileId, pt, description: opts.description, savedAt: new Date().toISOString() };
    saveEntry(entry);
    console.log(`Saved PT override for profile ${profileId} (ephemeral local only)`);
  });

program.command('list')
  .description('list saved PT overrides in the local store')
  .action(() => {
    const all = listEntries();
    if (!all.length) { console.log('No local PT overrides found'); process.exit(0); }
    all.forEach(e => console.log(`- ${e.profileId}: ${e.description || '<no description>'} (saved ${e.savedAt})`));
  });

program.command('show')
  .argument('<profileId>', 'profile ID to show')
  .action((profileId: string) => {
    const e = loadEntry(profileId);
    if (!e) { console.error('No such profileId in local overrides'); process.exit(2); }
    console.log(JSON.stringify(e, null, 2));
  });

program.command('remove')
  .argument('<profileId>', 'profile ID to remove')
  .action((profileId: string) => {
    const ok = removeEntry(profileId);
    if (!ok) { console.error('not found'); process.exit(2); }
    console.log('removed', profileId);
  });

program.parse(process.argv);
