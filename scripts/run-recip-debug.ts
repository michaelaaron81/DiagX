import { runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';

const profile = { compressor: { rla: 50 }, refrigeration: { refrigerantType: 'OTHER' } } as unknown as Record<string, unknown>;
const measurements = { dischargePressure: 120, suctionPressure: 80, suctionTemp: 90, compressorCurrent: 20, totalCylinders: 4, unloadedCylinders: 0 } as unknown as Record<string, unknown>;
const r = runReciprocatingCompressorEngine(measurements as unknown as Record<string, unknown>, profile as unknown as Record<string, unknown>);
console.log(JSON.stringify(r, null, 2));
