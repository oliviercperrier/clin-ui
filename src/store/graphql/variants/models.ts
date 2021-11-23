export enum Impact {
  High = "HIGH",
  Moderate = "MODERATE",
  Low = "LOW",
  Modifier = "MODIFIER",
}

export type ESResult<T> = {
  hits: {
    total?: number;
    edges: Array<ESResultNode<T>>;
  };
};

export type ESResultNode<T> = {
  node: T;
};

export type FrequenciesEntity = {
  internal: BoundType;
  topmed_bravo: BoundType;
  thousand_genomes: BoundType;
  gnomad_exomes_2_1_1: BoundType;
  gnomad_genomes_2_1_1: BoundType;
  gnomad_genomes_3_0: BoundType;
  [key: string]: any;
};

export type DonorsEntity = {
  patient_id: string;
  organization_id: string;
  gender: string;
  is_proband: boolean;
  family_id: string;
  last_update: number | string;
  ad_alt: number;
  ad_total: number;
  ad_ratio: number;
  affected_status: boolean;
  qd: number;
  gq: number;
};

export type VariantEntity = {
  id: string;
  hash: string;
  hgvsg: string;
  locus: string;
  participant_frequency: number;
  participant_total_number: number;
  participant_number: number;
  variant_class: string;
  rsnumber: string;
  variant_type: string;
  frequencies: {
    [key: string]: BoundType;
  }
  [key: string]: any;
};

export type GeneEntity = {
  omim_gene_id: string;
  symbol: string;
  location: string;
  orphanet: ESResult<OrphanetEntity[] | undefined | null>;
  omim: ESResult<OmimEntity[] | undefined | null>;
  hpo: ESResult<HpoEntity[] | undefined | null>;
  ddd: ESResult<DddEntity[] | undefined | null>;
  cosmic: ESResult<CosmicEntity[] | undefined | null>;
  [key: string]: any;
};

export type ConsequenceEntity = {
  symbol: string;
  consequences: string[];
  vep_impact: Impact;
  aa_change: string | undefined | null;
  impact_score: number | null;
  [key: string]: any;
};

export type Consequence = {
  node: ConsequenceEntity;
  [key: string]: any;
};

export type ClinVarData = string[] | undefined;

export type ClinVar = {
  clinvar_id: string | undefined;
  inheritance: ClinVarData;
  conditions: ClinVarData;
  clin_sig: ClinVarData;
  interpretations: ClinVarData;
};

export type BoundType = {
  ac: number;
  af: number;
  an: number;
  het: number;
  hom: number;
};

export type OmimCondition = {
  omimName: string;
  omimId: string;
};
export type OmimConditions = OmimCondition[];

export type HpoCondition = {
  hpoTermLabel: string;
  hpoTermTermId: string;
};
export type HpoConditions = HpoCondition[];

export type OrphanetCondition = {
  panel: string;
  disorderId: number;
};
export type OrphanetConditions = OrphanetCondition[];

export type DddCondition = string;
export type DddConditions = DddCondition[];

export type CosmicCondition = string;
export type CosmicConditions = CosmicCondition[];

export type Conditions =
  | OmimConditions
  | HpoConditions
  | OrphanetConditions
  | DddConditions
  | CosmicConditions;

export type OrphanetInheritance = string[][];

export type OmimInheritance = string[][];

export type SingleValuedInheritance = string;

export type Inheritance =
  | SingleValuedInheritance
  | OrphanetInheritance
  | OmimInheritance;

export type OmimGene = string[][];

export type CosmicEntity = {
  tumour_types_germline: string[];
};

export type DddEntity = {
  disease_name: string;
};

export type OrphanetEntity = {
  panel: string;
  inheritance: OrphanetInheritance | null | undefined;
  disorder_id: number;
};

export type HpoEntity = {
  hpo_term_label: string;
  hpo_term_id: string;
};

export type OmimEntity = {
  omim_id: string;
  name: string;
  inheritance: OmimInheritance | undefined | null;
};

export enum ClinicalGenesTableSource {
  orphanet = "Orphanet",
  omim = "OMIM",
  hpo = "HPO",
  ddd = "DDD",
  cosmic = "Cosmic",
}

export type FrequencyByLabEntity = BoundType & {
  lab_name: string;
};
