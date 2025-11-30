import { PTChartData } from './refrigerantData';
export interface PTValidationResult {
    ok: boolean;
    errors: string[];
    warnings: string[];
}
export declare function validatePTChart(pt: PTChartData | undefined | null): PTValidationResult;
export default validatePTChart;
