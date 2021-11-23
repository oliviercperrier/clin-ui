import React from "react";
import cx from "classnames";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { Card, Typography, Space, Tooltip, Spin } from "antd";
import intl from "react-intl-universal";
import capitalize from "lodash/capitalize";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/constants";
import ExpandableTable from "components/table/ExpandableTable";
import ExpandableCell from "components/table/ExpandableCell";
import NoData from "views/screens/variant/Entity/NoData";
import {
  Consequence,
  ConsequenceEntity,
  ESResult,
  ESResultNode,
  GeneEntity,
  Impact,
  VariantEntity,
} from "store/graphql/variants/models";
import { getVepImpactTag } from "views/screens/variant/Entity/index";
import SummaryCard from "views/screens/variant/Entity/ResumePanel/Summary";

import styles from "./index.module.scss";

interface OwnProps {
  data: {
    loading: boolean;
    variantData: VariantEntity | null;
  };
}

type TableGroup = {
  consequences: Consequence[];
  omim: string;
  symbol: string;
  biotype: string;
  ensembleGeneId: string;
};

type SymbolToConsequences = {
  [key: string]: TableGroup;
};

const { Text, Title } = Typography;
const INDEX_IMPACT_PREDICTION_FIELD = 0;
const INDEX_IMPACT_PREDICTION_SHORT_LABEL = 1;
const INDEX_IMPACT_SCORE = 2;

export const shortToLongPrediction: Record<string, string> = {
  "sift.d": "damaging",
  "sift.t": "tolerated",
  "polyphen2.p": "possibly damaging",
  "polyphen2.d": "probably damaging",
  "polyphen2.b": "benign",
  "fathmm.d": "damaging",
  "fathmm.t": "tolerated",
  "lrt.d": "deleterious",
  "lrt.n": "neutral",
  "lrt.u": "unknown",
};

const getLongPredictionLabelIfKnown = (
  predictionField: string,
  predictionShortLabel: string
) => {
  if (!predictionField || !predictionShortLabel) {
    return null;
  }
  const dictionaryPath = `${predictionField.toLowerCase()}.${predictionShortLabel.toLowerCase()}`;
  const longPrediction = shortToLongPrediction[dictionaryPath];
  return longPrediction || null;
};

const groupConsequencesBySymbol = (
  consequences: ESResultNode<ConsequenceEntity>[],
  genes: ESResultNode<GeneEntity>[]
) => {
  if (consequences.length === 0) {
    return {};
  }
  return consequences.reduce(
    (
      acc: SymbolToConsequences,
      consequence: ESResultNode<ConsequenceEntity>
    ) => {
      const symbol = consequence.node.symbol;
      if (!symbol) {
        return acc;
      }
      const gene = genes.find((g) => g.node.symbol === symbol);
      const omim = gene ? gene.node.omim_gene_id : "";
      const biotype = gene ? gene.node.biotype : "";
      const ensembleGeneId = consequence.node.ensembl_gene_id || "";
      const oldConsequences = acc[symbol]?.consequences || [];

      return {
        ...acc,
        [symbol]: {
          consequences: [...oldConsequences, { ...consequence }],
          omim,
          symbol,
          ensembleGeneId,
          biotype
        },
      };
    },
    {}
  );
};

const orderGenes = (mSymbolToConsequences: SymbolToConsequences) => {
  if (
    !mSymbolToConsequences ||
    Object.keys(mSymbolToConsequences).length === 0
  ) {
    return [];
  }
  return Object.entries(mSymbolToConsequences).map(([, values]) => ({
    ...values,
  }));
};

const orderConsequencesForTable = (tableGroups: TableGroup[]) => {
  if (!tableGroups || tableGroups.length === 0) {
    return [];
  }

  return tableGroups.map((tableGroup: TableGroup) => {
    const consequences = tableGroup.consequences;
    return {
      ...tableGroup,
      consequences: consequences,
    };
  });
};

const makeTables = (
  rawConsequences: ESResultNode<ConsequenceEntity>[],
  rawGenes: ESResultNode<GeneEntity>[]
) => {
  if (!rawConsequences || rawConsequences.length === 0) {
    return [];
  }
  const symbolToConsequences = groupConsequencesBySymbol(
    rawConsequences,
    rawGenes
  );
  const orderedGenes = orderGenes(symbolToConsequences);
  return orderConsequencesForTable(orderedGenes);
};

const makeRows = (consequences: ESResultNode<ConsequenceEntity>[]) =>
  consequences.map(
    (consequence: ESResultNode<ConsequenceEntity>, index: number) => ({
      key: `${index + 1}`,
      aa: consequence.node.aa_change,
      consequences: consequence.node.consequences.filter(
        (c) => c || c.length > 0
      ),
      codingDna: consequence.node.coding_dna_change,
      strand: consequence.node.strand,
      vep: consequence.node.vep_impact,
      impact: [
        [
          "Sift",
          consequence.node.predictions?.sift_pred,
          consequence.node.predictions?.sift_converted_rankscore,
        ],
        [
          "Polyphen2",
          consequence.node.predictions?.polyphen2_hvar_pred,
          consequence.node.predictions?.sift_converted_rankscore,
        ],
        [
          "Fathmm",
          consequence.node.predictions?.fathmm_pred,
          consequence.node.predictions?.fathmm_converted_rankscore,
        ],
        ["Cadd", null, consequence.node.predictions?.cadd_rankscore],
        ["Dann", null, consequence.node.predictions?.dann_rankscore],
        [
          "Lrt",
          consequence.node.predictions?.lrt_pred,
          consequence.node.predictions?.lrt_converted_rankscore,
        ],
        ["Revel", null, consequence.node.predictions?.revel_rankscore],
      ].filter(([, , score]) => score),
      conservation:
        consequence.node.conservations?.phylo_p17way_primate_rankscore,
      transcript: {
        id: consequence.node.ensembl_transcript_id,
        isCanonical: consequence.node.canonical,
      },
    })
  );

const columns = [
  {
    title: () =>
      intl.get("screen.variantDetails.summaryTab.consequencesTable.AAColumn"),
    dataIndex: "aa",
    render: (aa: string) => (
      <Tooltip placement="topLeft" title={aa || DISPLAY_WHEN_EMPTY_DATUM}>
        <div className={styles.longValue}>{aa || DISPLAY_WHEN_EMPTY_DATUM}</div>
      </Tooltip>
    ),
    className: `${styles.longValue}`,
    width: "10%",
  },
  {
    title: () =>
      intl.get(
        "screen.variantDetails.summaryTab.consequencesTable.ConsequenceColumn"
      ),
    dataIndex: "consequences",
    render: (consequences: string[]) => {
      if (consequences.length === 0) {
        return <></>;
      }
      return (
        <ExpandableCell
          dataSource={consequences}
          renderItem={(item: any, id): React.ReactNode => (
            <StackLayout key={id} horizontal className={styles.cellList}>
              <Text>{item}</Text>
            </StackLayout>
          )}
        />
      );
    },
  },
  {
    title: () =>
      intl.get(
        "screen.variantDetails.summaryTab.consequencesTable.CDNAChangeColumn"
      ),
    dataIndex: "codingDna",
    render: (codingDna: string) => (
      <Tooltip
        placement="topLeft"
        title={codingDna || DISPLAY_WHEN_EMPTY_DATUM}
      >
        <div className={styles.longValue}>
          {codingDna || DISPLAY_WHEN_EMPTY_DATUM}
        </div>
      </Tooltip>
    ),
  },
  {
    title: () =>
      intl.get("screen.variantDetails.summaryTab.consequencesTable.VEP"),
    dataIndex: "vep",
    render: (vep: Impact) => {
      return getVepImpactTag(vep.toLowerCase());
    },
  },
  {
    title: () =>
      intl.get(
        "screen.variantDetails.summaryTab.consequencesTable.ImpactColumn"
      ),
    dataIndex: "impact",
    render: (impacts: string[][]) => {
      if (impacts.length === 0) {
        return DISPLAY_WHEN_EMPTY_DATUM;
      }

      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={2}
          dataSource={impacts}
          renderItem={(item: any, id): React.ReactNode => {
            const predictionField = item[INDEX_IMPACT_PREDICTION_FIELD];
            const score = item[INDEX_IMPACT_SCORE];
            const predictionShortLabel =
              item[INDEX_IMPACT_PREDICTION_SHORT_LABEL];

            const predictionLongLabel = getLongPredictionLabelIfKnown(
              predictionField,
              predictionShortLabel
            );

            const label = predictionLongLabel || predictionShortLabel;

            const description = label
              ? `${capitalize(label)} - ${score}`
              : score;
            return (
              <StackLayout key={id} horizontal className={styles.cellList}>
                <Text type={"secondary"}>{predictionField}:</Text>
                <Text>{description}</Text>
              </StackLayout>
            );
          }}
        />
      );
    },
  },
  {
    title: () =>
      intl.get(
        "screen.variantDetails.summaryTab.consequencesTable.ConservationColumn"
      ),
    dataIndex: "conservation",
    render: (conservation: number) =>
      conservation == null ? DISPLAY_WHEN_EMPTY_DATUM : conservation,
  },
  {
    title: () =>
      intl.get(
        "screen.variantDetails.summaryTab.consequencesTable.TranscriptsColumn"
      ),
    dataIndex: "transcript",
    render: (transcript: { id: string; isCanonical?: boolean }) =>
      transcript.id ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.ensembl.org/id/${transcript.id}`}
        >
          {transcript.id}
        </a>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
  },
];

const ResumePanel = ({ data }: OwnProps) => {
  const variantData = data.variantData;
  const consequences = (
    variantData?.consequences as ESResult<ConsequenceEntity>
  )?.hits.edges;
  const genes = (variantData?.genes as ESResult<GeneEntity>)?.hits.edges;
  const tables = makeTables(consequences, genes);
  const hasTables = tables.length > 0;

  return (
    <StackLayout className={cx(styles.resumePanel, "page-container")} vertical>
      <Space direction="vertical" size={16}>
        <SummaryCard
          loading={data.loading}
          variant={variantData}
          genes={genes}
        />
        <Title level={4} className={styles.consequenceTitle}>
          {intl.get("screen.variantDetails.summaryTab.consequencesTable.title")}
        </Title>
        <StackLayout className={styles.consequenceCards} vertical>
          <Spin spinning={data.loading}>
            {hasTables ? (
              tables.map((tableData: TableGroup, index: number) => {
                const symbol = tableData.symbol;
                const omim = tableData.omim;
                const biotype = tableData.biotype;
                const orderedConsequences = tableData.consequences;

                return (
                  <Card
                    title={
                      <Space size={12}>
                        <Space size={4}>
                          <span>
                            {intl.get("screen.variant.entity.table.gene")}
                          </span>
                          <span>
                            <a
                              href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${symbol}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {symbol}
                            </a>
                          </span>
                        </Space>
                        <Space size={4}>
                          {omim && (
                            <>
                              <span>Omim</span>
                              <span>
                                <a
                                  href={`https://omim.org/entry/${omim}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {omim}
                                </a>
                              </span>
                            </>
                          )}
                        </Space>
                        <span className="bold value">{ biotype }</span>
                      </Space>
                    }
                    className={styles.card}
                    key={index}
                  >
                    <ExpandableTable
                      nOfElementsWhenCollapsed={1}
                      buttonText={(showAll, hiddenNum) =>
                        showAll
                          ? intl.get(
                              "screen.variant.entity.table.hidetranscript"
                            )
                          : `${intl.get(
                              "screen.variant.entity.table.showtranscript"
                            )} (${hiddenNum})`
                      }
                      key={index}
                      dataSource={makeRows(orderedConsequences)}
                      columns={columns}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                );
              })
            ) : (
              <Card>
                <NoData />
              </Card>
            )}
          </Spin>
        </StackLayout>
      </Space>
    </StackLayout>
  );
};

export default ResumePanel;
