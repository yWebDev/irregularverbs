/**
 * Levenshtein distance on UTF-8 bytes at given linear-memory offsets.
 * Callers pass English verb strings encoded as UTF-8 (TextEncoder); ASCII is a subset.
 */
const MAX_BYTES: i32 = 256;

export function levenshteinUtf8(aPtr: usize, aLen: i32, bPtr: usize, bLen: i32): i32 {
  if (aLen == 0) return bLen;
  if (bLen == 0) return aLen;
  if (aLen > MAX_BYTES || bLen > MAX_BYTES) return -1;

  const prev = new StaticArray<i32>(MAX_BYTES + 1);
  const curr = new StaticArray<i32>(MAX_BYTES + 1);
  for (let j = 0; j <= bLen; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= aLen; i++) {
    curr[0] = i;
    const ca = load<u8>(aPtr + (i - 1));
    for (let j = 1; j <= bLen; j++) {
      const cb = load<u8>(bPtr + (j - 1));
      const cost: i32 = ca == cb ? 0 : 1;
      const del: i32 = prev[j] + 1;
      const ins: i32 = curr[j - 1] + 1;
      const sub: i32 = prev[j - 1] + cost;
      let m: i32 = del;
      if (ins < m) m = ins;
      if (sub < m) m = sub;
      curr[j] = m;
    }
    for (let j = 0; j <= bLen; j++) {
      prev[j] = curr[j];
    }
  }
  return prev[bLen];
}
