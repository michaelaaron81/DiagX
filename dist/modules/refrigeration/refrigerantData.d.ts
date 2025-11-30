/**
 * Refrigerant Pressure-Temperature Data (copied from repository source)
 * Source: ASHRAE Fundamentals 2021 and manufacturer tables
 * NOTE: Keep this file under src/modules/refrigeration so the engine uses a local, auditable PT dataset.
 */
export type PTChartData = Array<[number, number]>;
export interface RefrigerantData {
    name: string;
    type: string;
    gwp: number;
    source: string;
    notes?: string;
    warnings?: string[];
    pt: PTChartData;
}
export declare const REFRIGERANT_DATA: Record<string, RefrigerantData>;
export declare function getRefrigerantTypes(): string[];
export declare function getRefrigerantData(type: string): RefrigerantData | null;
export declare function isValidRefrigerant(type: string): boolean;
