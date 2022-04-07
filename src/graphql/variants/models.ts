import { ArrangerResultsTree } from 'graphql/models';

export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

export type ExternalFrequenciesEntity = {
  topmed_bravo: BoundType;
  thousand_genomes: BoundType;
  gnomad_exomes_2_1_1: BoundType;
  gnomad_genomes_2_1_1: BoundType;
  gnomad_genomes_3_0: BoundType;
};

export type FrequencyByAnalysisEntity = {
  id: string;
  analysis_code: string;
  analysis_display_name: string;
  affected: BoundType;
  non_affected: BoundType;
  total: BoundType;
};

export type frequency_RQDMEntity = {
  affected: BoundType;
  non_affected: BoundType;
  total: BoundType;
};

export type HcComplement = {
  symbol: string;
  locus: string[];
};

export type HcComplementHits = {
  hits: {
    edges: {
      node: HcComplement;
    }[];
  };
};

export type PossiblyHcComplement = {
  symbol: string;
  count: number;
};

export type PossiblyHcComplementHits = {
  hits: {
    edges: {
      node: PossiblyHcComplement;
    }[];
  };
};

export type DonorsEntity = {
  id: string;
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
  filters?: string[];
  zygosity?: string;
  transmission?: string;
  analysis_code?: string;
  analysis_display_name?: string;
  mother_id?: string;
  mother_zygosity?: string;
  mother_affected_status?: boolean;
  mother_calls?: number[];
  father_id?: string;
  father_zygosity?: string;
  father_affected_status?: boolean;
  father_calls?: number[];
  parental_origin?: string;
  is_possibly_hc?: boolean;
  possibly_hc_complement?: PossiblyHcComplementHits;
  hc_complement?: HcComplementHits;
  is_hc?: boolean;
};

export type VariantEntity = {
  id: string;
  hash: string;
  hgvsg: string;
  locus: string;
  panels: string[];
  variant_class: string;
  rsnumber: string;
  variant_type: string;
  frequency_RQDM: frequency_RQDMEntity;
  consequences?: ArrangerResultsTree<ConsequenceEntity>;
  varsome?: Varsome;
  genes?: ArrangerResultsTree<GeneEntity>;
  donors?: ArrangerResultsTree<DonorsEntity>;
  external_frequencies?: ExternalFrequenciesEntity;
  frequencies_by_analysis?: FrequencyByAnalysisEntity;
  analysis_display_name?: string;
  chromosome: string;
  start: number;
  alternate: string;
  reference: string;
  assembly_version: string;
  clinvar: ClinVar;
  rsnumbermber: string;
  last_annotation_update: number;
};

export type VarsomeClassifications = {
    met_criteria: boolean;
    name: string;
    id: string;
}
type VarsomeVerdict = {
  benign_subscore: string;
  clinical_score: number;
  pathogenic_subscore: string;
  verdict: string;
}

type VarsomeAcmg = {
  verdict: VarsomeVerdict;
  classifications: ArrangerResultsTree<VarsomeClassifications>;
}

export type Varsome = {
  acmg: VarsomeAcmg;
  variant_id: string;
}

export type GeneEntity = {
  id: string;
  omim_gene_id: string;
  symbol: string;
  location: string;
  orphanet: ArrangerResultsTree<OrphanetEntity>;
  omim: ArrangerResultsTree<OmimEntity>;
  hpo: ArrangerResultsTree<HpoEntity>;
  ddd: ArrangerResultsTree<DddEntity>;
  cosmic: ArrangerResultsTree<CosmicEntity>;
  biotype: string;
};

export type ConsequenceEntity = {
  id: string;
  symbol: string;
  consequences: string[];
  vep_impact: Impact;
  aa_change: string | undefined | null;
  impact_score: number | null;
  canonical: boolean;
  coding_dna_change: string;
  strand: string;
  refseq_mrna_id: string[];
  ensembl_transcript_id: string;
  ensembl_gene_id: string;
  predictions: PredictionEntity;
  conservations: ConservationsEntity;
};

export type ConservationsEntity = {
  phylo_p17way_primate_rankscore: number;
};

export type PredictionEntity = {
  fathmm_pred: number;
  FATHMM_converted_rankscore: number;
  cadd_score: number;
  dann_score: number;
  lrt_pred: string;
  lrt_converted_rankscore: number;
  revel_rankscore: number;
  sift_converted_rank_score: number;
  sift_pred: string;
  polyphen2_hvar_score: number;
  polyphen2_hvar_pred: string;
};

export type Consequence = {
  node: ConsequenceEntity;
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
  hom: number;
  pn: number;
  pc: number;
  pf: number;
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

export type Inheritance = SingleValuedInheritance | OrphanetInheritance | OmimInheritance;

export type OmimGene = string[][];

export type CosmicEntity = {
  id: string;
  tumour_types_germline: string[];
};

export type DddEntity = {
  id: string;
  disease_name: string;
};

export type OrphanetEntity = {
  id: string;
  panel: string;
  inheritance: OrphanetInheritance | null | undefined;
  disorder_id: number;
};

export type HpoEntity = {
  id: string;
  hpo_term_label: string;
  hpo_term_id: string;
};

export type OmimEntity = {
  id: string;
  omim_id: string;
  name: string;
  inheritance: OmimInheritance | undefined | null;
};

export enum ClinicalGenesTableSource {
  orphanet = 'Orphanet',
  omim = 'OMIM',
  hpo = 'HPO',
  ddd = 'DDD',
  cosmic = 'Cosmic',
}

export type FrequencyByLabEntity = BoundType & {
  id: string;
  lab_name: string;
};

export enum GenomicFeatureType {
  Variant = 'variant',
  GENE = 'gene',
}

export type SearchText = string;

export type SuggestionId = string;

export type Suggestion = {
  locus: string | undefined;
  type: GenomicFeatureType;
  matchedText: string;
  suggestion_id: string;
  symbol?: string;
  rsnumber?: string;
  ensembl_gene_id?: string;
};

export type SelectedSuggestion = {
  type: string;
  ensembl_gene_id?: string;
  suggest: any;
  suggestionId: SuggestionId;
  symbol?: string;
  rsnumber?: string;
  locus?: string;
  hgvsg?: string;
  chromosome?: string;
};
