export type ValidationSeverity = 'info' | 'warning' | 'error';
export interface ValidationIssue {
    field: string;
    code: string;
    message: string;
    severity: ValidationSeverity;
}
export interface ValidationResult {
    ok: boolean;
    issues: ValidationIssue[];
}
