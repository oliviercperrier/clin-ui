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

export type FrequenciesByLab = {
  [key: string]: BoundType;
}

export type DonorsEntity = {};

export type VariantEntity = {
  id: string;
  hash: string;
  hgvsg: string;
  locus: string;
  participant_number: number;
  variant_class: string;
  rsnumber: string;
  variant_type: string;
  [key: string]: any;
};

export type GeneEntity = {
  omim_gene_id: string;
  symbol: string;
  location: string;
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

type ClinVarData = string[] | undefined;

export type ClinVar = {
  clinvar_id: string | undefined;
  clin_sig: ClinVarData;
};

type BoundType = {
  ac: number;
  af: number;
  an: number;
  het: number;
  hom: number;
};
