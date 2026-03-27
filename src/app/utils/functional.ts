/**
 * Pure functional helpers (no I/O, no mutation of inputs). Used as fallbacks when
 * WebAssembly or Web Workers are unavailable (e.g. SSR) and for unit tests.
 */

/** Iterative Levenshtein distance on UTF-16 code units (aligned with WASM string indexing). */
export function levenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const prev = new Array<number>(bl + 1);
  const curr = new Array<number>(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;

  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= bl; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost,
      );
    }
    for (let j = 0; j <= bl; j++) prev[j] = curr[j];
  }
  return prev[bl]!;
}

export type VerbSortKey = 'base' | 'pastSimple' | 'pastParticiple';

export interface VerbRowLike {
  id: string;
  base: string;
  pastSimple: string;
  pastSimpleAlt?: string;
  pastParticiple: string;
  pastParticipleAlt?: string;
}

/** Synchronous filter + sort (mirrors the web worker for non-browser environments). */
export function filterAndSortVerbs(
  verbs: readonly VerbRowLike[],
  filter: string,
  sortKey: VerbSortKey,
): VerbRowLike[] {
  let result = verbs.slice();
  const f = filter.trim().toLowerCase();
  if (f) {
    result = result.filter(
      (v) =>
        (v.base ?? '').toLowerCase().includes(f) ||
        (v.pastSimple ?? '').toLowerCase().includes(f) ||
        (v.pastParticiple ?? '').toLowerCase().includes(f) ||
        (v.pastSimpleAlt?.toLowerCase().includes(f) ?? false) ||
        (v.pastParticipleAlt?.toLowerCase().includes(f) ?? false),
    );
  }
  result.sort((a, b) =>
    String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, {
      sensitivity: 'base',
    }),
  );
  return result;
}

/**
 * When the user types a filter, rank rows by smallest Levenshtein distance to the
 * base form (tie-breaker after alphabetical sort).
 */
export function rankVerbsByBaseSimilarity(
  verbs: readonly VerbRowLike[],
  term: string,
  distance: (a: string, b: string) => number,
): VerbRowLike[] {
  const t = term.trim().toLowerCase();
  if (!t) return verbs.slice();
  return verbs
    .slice()
    .sort((a, b) => {
      const da = distance(t, (a.base ?? '').toLowerCase());
      const db = distance(t, (b.base ?? '').toLowerCase());
      if (da !== db) return da - db;
      return (a.base ?? '').localeCompare(b.base ?? '', undefined, {
        sensitivity: 'base',
      });
    });
}
