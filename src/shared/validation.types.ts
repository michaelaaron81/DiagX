// Phase 1 shared validation contract (non-physics, structural only)
// Keep conservative and implementation-agnostic so it can be adopted across modules

export type ValidationSeverity = 'info' | 'warning' | 'error';

export interface ValidationIssue {
  field: string; // measurement or field name (e.g. 'suctionPressure')
  code: string; // canonical code such as 'missing' | 'out_of_range' | 'inconsistent'
  message: string; // short factual message
  severity: ValidationSeverity;
}

export interface ValidationResult {
  ok: boolean; // true when there are no issues of severity 'error'
  issues: ValidationIssue[];
}
