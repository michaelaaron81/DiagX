import { runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';

const profile = { compressor: { rla: 50 }, refrigeration: { refrigerantType: 'OTHER' } } as any;
const measurements = { dischargePressure: 120, suctionPressure: 80, suctionTemp: 90, compressorCurrent: 20, totalCylinders: 4, unloadedCylinders: 0 } as any;
const r = runReciprocatingCompressorEngine(measurements, profile);
console.log(JSON.stringify(r, null, 2));
