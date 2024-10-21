export interface VerbDetailsDTO {
  id: string;
  base: string;
  pastSimple: string;
  pastSimpleAlt?: string;
  pastParticiple: string;
  pastParticipleAlt?: string;
}

export type VerbDetails = Omit<
  VerbDetailsDTO,
  'pastSimpleAlt' | 'pastParticipleAlt'
>;

export interface VerbSearchOption extends VerbDetails {
  matched: keyof VerbDetails;
}
