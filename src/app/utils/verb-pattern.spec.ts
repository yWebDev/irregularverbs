import { VerbDetails } from '../model/verb-details';
import { categorizeVerbPattern, countVerbPatterns } from './verb-pattern';

describe('verb-pattern', () => {
  it('categorizes AAA, ABA, ABB, ABC', () => {
    const cut: VerbDetails = {
      id: '1',
      base: 'cut',
      pastSimple: 'cut',
      pastParticiple: 'cut',
    };
    expect(categorizeVerbPattern(cut)).toBe('AAA');

    const come: VerbDetails = {
      id: '2',
      base: 'come',
      pastSimple: 'came',
      pastParticiple: 'come',
    };
    expect(categorizeVerbPattern(come)).toBe('ABA');

    const buy: VerbDetails = {
      id: '3',
      base: 'buy',
      pastSimple: 'bought',
      pastParticiple: 'bought',
    };
    expect(categorizeVerbPattern(buy)).toBe('ABB');

    const go: VerbDetails = {
      id: '4',
      base: 'go',
      pastSimple: 'went',
      pastParticiple: 'gone',
    };
    expect(categorizeVerbPattern(go)).toBe('ABC');
  });

  it('countVerbPatterns aggregates', () => {
    const verbs: VerbDetails[] = [
      {
        id: '1',
        base: 'cut',
        pastSimple: 'cut',
        pastParticiple: 'cut',
      },
      {
        id: '2',
        base: 'go',
        pastSimple: 'went',
        pastParticiple: 'gone',
      },
    ];
    const c = countVerbPatterns(verbs);
    expect(c.AAA).toBe(1);
    expect(c.ABC).toBe(1);
    expect(c.ABA).toBe(0);
    expect(c.ABB).toBe(0);
  });
});
