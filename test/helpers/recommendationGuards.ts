import { Recommendation } from '../../src/shared/wshp.types';

const FORBIDDEN_PATTERNS: RegExp[] = [
  /\bshut\s+off\b/i,
  /\bturn\s+off\b/i,
  /\bturn\s+on\b/i,
  /\bcycle\s+power\b/i,
  /\breset\b/i,
  /\bclean\b/i,
  /\breplace\b/i,
  /\bchange\b/i,
  /\badjust\b/i,
  /\btighten\b/i,
  /\bloosen\b/i,
  /\bopen\b/i,
  /\bclose\b/i,
  /\bverify\s+breaker\b/i,
  /\bwire\b/i,
  /\bjumper\b/i
];

export function assertRecommendationTextSafe(rec: Recommendation): void {
  const text = [rec.summary, rec.rationale, ...(rec.notes ?? [])]
    .filter(Boolean)
    .join(' ');

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error(
        `Forbidden repair-like wording in recommendation ${rec.id}: pattern ${pattern}`
      );
    }
  }
}
