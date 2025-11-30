import { ScrollCompressorMeasurements, ScrollCompressorResult, ScrollCompressorConfig } from './scroll.types';
import { DiagnosticStatus, Recommendation } from '../../shared/wshp.types';
export declare function generateScrollRecommendations(compAnalysis: {
    status: DiagnosticStatus;
}, currentAnalysis: {
    status: DiagnosticStatus;
}, measurements: ScrollCompressorMeasurements): Recommendation[];
export declare function runScrollCompressorEngine(measurements: ScrollCompressorMeasurements, profile: ScrollCompressorConfig): ScrollCompressorResult;
