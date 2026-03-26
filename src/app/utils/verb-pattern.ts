import { VerbDetails } from '../model/verb-details';

export type VerbPatternKind = 'AAA' | 'ABA' | 'ABB' | 'ABC';

/** Normalize for pattern comparison (first surface form). */
function norm(s: string | undefined): string {
  return (s ?? '').trim().toLowerCase();
}

/**
 * Classifies irregular verb form patterns: AAA (cut/cut/cut), ABA (come/came/come),
 * ABB (buy/bought/bought), ABC (all distinct).
 */
export function categorizeVerbPattern(v: VerbDetails): VerbPatternKind {
  const base = norm(v.base);
  const past = norm(v.pastSimpleAlt ? v.pastSimple.split('/')[0] : v.pastSimple);
  const part = norm(
    v.pastParticipleAlt ? v.pastParticiple.split('/')[0] : v.pastParticiple,
  );

  if (base === past && past === part) {
    return 'AAA';
  }
  if (base === part && base !== past) {
    return 'ABA';
  }
  if (past === part && base !== past) {
    return 'ABB';
  }
  return 'ABC';
}

export function countVerbPatterns(
  verbs: VerbDetails[],
): Record<VerbPatternKind, number> {
  const counts: Record<VerbPatternKind, number> = {
    AAA: 0,
    ABA: 0,
    ABB: 0,
    ABC: 0,
  };
  for (const v of verbs) {
    counts[categorizeVerbPattern(v)] += 1;
  }
  return counts;
}
