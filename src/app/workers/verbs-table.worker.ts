/// <reference lib="webworker" />

import type { VerbDetails } from '../model/verb-details';
import type { VerbSortKey } from '../utils/functional';

export interface VerbsTableWorkerPayload {
  verbs: VerbDetails[];
  filter: string;
  sortKey: VerbSortKey;
}

addEventListener('message', (event: MessageEvent<VerbsTableWorkerPayload>) => {
  const { verbs, filter, sortKey } = event.data;
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
  postMessage(result);
});
