export interface VerbDetailsDTO {
  id: string;
  base: string;
  pastSimple: string;
  pastSimpleAlt?: string;
  pastParticiple: string;
  pastParticipleAlt?: string;
}

/** Table and API rows include optional alternate surface forms. */
export type VerbDetails = VerbDetailsDTO;

export interface VerbSearchOption extends VerbDetails {
  matched: keyof VerbDetails;
}
