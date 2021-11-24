import { ArrangerResultsTree, ArrangerEdge } from "store/graphql/models";
import {
  ClinVar,
  Conditions,
  Inheritance,
  OmimEntity,
  ClinicalGenesTableSource,
  CosmicEntity,
  DddEntity,
  OrphanetEntity,
  GeneEntity,
  HpoEntity,
} from "store/graphql/variants/models";
import { toKebabCase } from "utils/helper";

const getEdgesOrDefault = (arr: ArrangerResultsTree<any>) =>
  arr?.hits?.edges || [];

const keepOnlyOmimWithId = (arr: ArrangerEdge<OmimEntity>[]) =>
  arr.filter((omimNode: ArrangerEdge<OmimEntity>) => omimNode.node.omim_id);

export const makeClinVarRows = (clinvar: ClinVar) => {
  if (!clinvar || !clinvar.conditions?.length) {
    return [];
  }
  const inheritance = (clinvar.inheritance || [])[0] || "";
  const interpretation = (clinvar.clin_sig || [])[0] || "";

  return clinvar.conditions.map((condition: string, index: number) => ({
    key: `${index}`,
    inheritance,
    interpretation,
    condition,
  }));
};

const orphanetFromEdges = (
  gene: ArrangerEdge<GeneEntity>,
  orphanetEdges: ArrangerEdge<OrphanetEntity>[]
) =>
  orphanetEdges.length > 0
    ? {
        source: ClinicalGenesTableSource.orphanet,
        gene: gene.node.symbol,
        conditions: orphanetEdges.map((orphanetNode) => ({
          panel: orphanetNode.node.panel,
          disorderId: orphanetNode.node.disorder_id,
        })),
        inheritance: orphanetEdges.map(
          (orphanetNode) => orphanetNode.node.inheritance
        ),
      }
    : null;

const omimFromEdges = (
  gene: ArrangerEdge<GeneEntity>,
  omimEdges: ArrangerEdge<OmimEntity>[]
) =>
  omimEdges.length > 0
    ? {
        source: ClinicalGenesTableSource.omim,
        gene: [gene.node.symbol, gene.node.omim_gene_id],
        conditions: omimEdges.map((omimNode: ArrangerEdge<OmimEntity>) => ({
          omimName: omimNode.node.name,
          omimId: omimNode.node.omim_id,
        })),
        inheritance:
          omimEdges.map(
            (omimNode: ArrangerEdge<OmimEntity>) => omimNode.node.inheritance
          ) || [],
      }
    : null;

const hpoFromEdges = (
  gene: ArrangerEdge<GeneEntity>,
  hpoEdges: ArrangerEdge<HpoEntity>[]
) =>
  hpoEdges.length > 0
    ? {
        source: ClinicalGenesTableSource.hpo,
        gene: gene.node.symbol,
        conditions: hpoEdges.map((hpoNode: ArrangerEdge<HpoEntity>) => ({
          hpoTermLabel: hpoNode.node.hpo_term_label,
          hpoTermTermId: hpoNode.node.hpo_term_id,
        })),
        inheritance: "",
      }
    : null;

const dddFromEdges = (
  gene: ArrangerEdge<GeneEntity>,
  dddEdges: ArrangerEdge<DddEntity>[]
) =>
  dddEdges.length > 0
    ? {
        source: ClinicalGenesTableSource.ddd,
        gene: gene.node.symbol,
        conditions: dddEdges.map(
          (dddNode: ArrangerEdge<DddEntity>) => dddNode.node.disease_name
        ),
        inheritance: "",
      }
    : null;

const cosmicFromEdges = (
  gene: ArrangerEdge<GeneEntity>,
  cosmicEdges: ArrangerEdge<CosmicEntity>[]
) =>
  cosmicEdges.length > 0
    ? {
        source: ClinicalGenesTableSource.cosmic,
        gene: gene.node.symbol,
        conditions: cosmicEdges
          .map(
            (cosmicNode: ArrangerEdge<CosmicEntity>) =>
              cosmicNode.node.tumour_types_germline
          )
          .flat(),
        inheritance: "",
      }
    : null;

export const makeUnGroupedDataRows = (genes: ArrangerEdge<GeneEntity>[]) => {
  if (!genes) {
    return [];
  }

  return genes.map((gene: ArrangerEdge<GeneEntity>) => {
    const rowOrphanet = orphanetFromEdges(
      gene,
      getEdgesOrDefault(gene.node.orphanet)
    );
    const rowOmim = omimFromEdges(
      gene,
      keepOnlyOmimWithId(getEdgesOrDefault(gene.node.omim))
    );
    const rowCosmic = cosmicFromEdges(
      gene,
      getEdgesOrDefault(gene.node.cosmic)
    );
    const rowHpo = hpoFromEdges(gene, getEdgesOrDefault(gene.node.hpo));
    const rowDdd = dddFromEdges(gene, getEdgesOrDefault(gene.node.ddd));

    return [rowOrphanet, rowOmim, rowHpo, rowDdd, rowCosmic]
      .filter((row) => row)
      .flat();
  });
};

export const groupRowsBySource = (ungroupedDataTable: any[]) => {
  const orphanetRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.orphanet);
  const omimRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.omim);
  const hpoRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.hpo);
  const dddRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.ddd);
  const cosmicRows = ungroupedDataTable
    .flat()
    .filter((row) => row.source === ClinicalGenesTableSource.cosmic);

  return [...orphanetRows, ...omimRows, ...hpoRows, ...dddRows, ...cosmicRows];
};

export const makeGenesOrderedRow = (
  genesHits: ArrangerResultsTree<GeneEntity>
) => {
  const genes = genesHits?.hits?.edges;

  if (!genes || genes.length === 0) {
    return [];
  }

  const ungroupedRows = makeUnGroupedDataRows(genes);
  const groupedRows = groupRowsBySource(ungroupedRows);

  return groupedRows.map((row, index) => ({
    source: row.source,
    gene: row.gene,
    conditions: row.conditions as Conditions,
    inheritance: row.inheritance as Inheritance,
    key: toKebabCase(`${index}-${[row.gene].flat().join("-")}`),
  }));
};
