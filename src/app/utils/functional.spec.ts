import { filterAndSortVerbs, levenshteinDistance, rankVerbsByBaseSimilarity } from './functional';

describe('functional utils', () => {
  it('levenshteinDistance matches known edit distances', () => {
    expect(levenshteinDistance('', '')).toBe(0);
    expect(levenshteinDistance('go', 'go')).toBe(0);
    expect(levenshteinDistance('go', 'went')).toBe(4);
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('filterAndSortVerbs filters by substring and sorts alphabetically', () => {
    const verbs = [
      { id: '1', base: 'take', pastSimple: 'took', pastParticiple: 'taken' },
      { id: '2', base: 'go', pastSimple: 'went', pastParticiple: 'gone' },
    ];
    const out = filterAndSortVerbs(verbs, 'go', 'base');
    expect(out.map((v) => v.base)).toEqual(['go']);
  });

  it('rankVerbsByBaseSimilarity orders by distance to term', () => {
    const verbs = [
      { id: '1', base: 'take', pastSimple: 'took', pastParticiple: 'taken' },
      { id: '2', base: 'go', pastSimple: 'went', pastParticiple: 'gone' },
      { id: '3', base: 'goo', pastSimple: 'went', pastParticiple: 'gone' },
    ];
    const out = rankVerbsByBaseSimilarity(verbs, 'go', levenshteinDistance);
    expect(out[0].base).toBe('go');
    expect(out[1].base).toBe('goo');
  });
});
