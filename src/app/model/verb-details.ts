export interface VerbDetails {
  base: string;
  pastSimple: string;
  pastParticiple: string;
}

export interface VerbSearchOption extends VerbDetails {
  matched: keyof VerbDetails;
}
