import React from "react";
import cx from "classnames";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { useTabFrequenciesData } from "store/graphql/variants/tabActions";
import intl from "react-intl-universal";
import { Card, Table, Spin, Space } from "antd";
import { toExponentialNotation } from "utils/helper";
import { FrequenciesEntity } from "store/graphql/variants/models";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/constants";
import ServerError from "components/Results/ServerError";
import NoData from "views/screens/variant/Entity/NoData";
import { ArrangerEdge, ArrangerResultsTree } from "store/graphql/models";

import styles from "./index.module.scss";

interface OwnProps {
  className?: string;
  hash: string;
}

type ExternalCohortDatum = number | string | null;

type Row = {
  cohort: {
    cohortName: string;
    link?: string;
  };
  alt: ExternalCohortDatum;
  altRef: ExternalCohortDatum;
  homozygotes: ExternalCohortDatum;
  frequency: ExternalCohortDatum;
  key: string;
};

const hasAtLeastOneTruthyProperty = (obj: Omit<Row, "key" | "cohort">) =>
  Object.values(obj).some((e) => e);

const displayDefaultIfNeeded = (datum: ExternalCohortDatum) =>
  datum == null ? DISPLAY_WHEN_EMPTY_DATUM : datum;

const isExternalCohortsTableEmpty = (rows: Row[]) =>
  rows.every(
    ({ cohort, key, ...visibleRow }: Row) =>
      !hasAtLeastOneTruthyProperty(visibleRow)
  );

const cohortsColumns = [
  {
    title: () => intl.get("screen.variantDetails.frequenciesTab.LDMColumn"),
    dataIndex: "cohort",
    render: (cohort: { cohortName: string; link?: string }) => {
      const cohortName = cohort.cohortName;
      if (["TopMed", "Gnomad Genomes (v3)"].includes(cohortName)) {
        return (
          <a href={cohort.link} target="_blank" rel="noopener noreferrer">
            {cohortName}
          </a>
        );
      }
      return cohortName;
    },
  },
  {
    title: () => intl.get("screen.variantDetails.frequenciesTab.nbAllelesAlt"),
    dataIndex: "alt",
    render: displayDefaultIfNeeded,
  },
  {
    title: () =>
      intl.get("screen.variantDetails.frequenciesTab.nbAllelesAltRef"),
    dataIndex: "altRef",
    render: displayDefaultIfNeeded,
  },
  {
    title: () => intl.get("screen.variantDetails.frequenciesTab.nbHomozygotes"),
    dataIndex: "homozygotes",
    render: displayDefaultIfNeeded,
  },
  {
    title: () => intl.get("screen.variantDetails.frequenciesTab.frequencies"),
    dataIndex: "frequency",
    render: displayDefaultIfNeeded,
  },
];

const makeRowFromFrequencies = (
  frequencies: FrequenciesEntity,
  locus: string
): Row[] => {
  if (!frequencies || Object.keys(frequencies).length === 0) {
    return [];
  }

  const topmed = frequencies.topmed_bravo || {};
  const gnomadGenomes3 = frequencies.gnomad_genomes_3_0 || {};
  const gnomadGenomes2_1_1 = frequencies.gnomad_genomes_2_1_1 || {};
  const gnomadExomes2_1_1 = frequencies.gnomad_exomes_2_1_1 || {};
  const oneThousandsGenomes = frequencies.thousand_genomes || {};

  return [
    {
      cohort: {
        cohortName: "TopMed",
        link: `https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/${locus}`,
      },
      alt: topmed.ac,
      altRef: topmed.an,
      homozygotes: topmed.hom,
      frequency: toExponentialNotation(topmed.af),
    },
    {
      cohort: {
        cohortName: "Gnomad Genomes (v3)",
        link: `https://gnomad.broadinstitute.org/variant/${locus}?dataset=gnomad_r3`,
      },
      alt: gnomadGenomes3.ac,
      altRef: gnomadGenomes3.an,
      homozygotes: gnomadGenomes3.hom,
      frequency: toExponentialNotation(gnomadGenomes3.af),
    },
    {
      cohort: {
        cohortName: "Gnomad Genomes (v2.1.1)",
      },
      alt: gnomadGenomes2_1_1.ac,
      altRef: gnomadGenomes2_1_1.an,
      homozygotes: gnomadGenomes2_1_1.hom,
      frequency: toExponentialNotation(gnomadGenomes2_1_1.af),
    },
    {
      cohort: {
        cohortName: "Gnomad Exomes (v2.1.1)",
      },
      alt: gnomadExomes2_1_1.ac,
      altRef: gnomadExomes2_1_1.an,
      homozygotes: gnomadExomes2_1_1.hom,
      frequency: toExponentialNotation(gnomadExomes2_1_1.af),
    },
    {
      cohort: {
        cohortName: "1000 Genomes",
      },
      alt: oneThousandsGenomes.ac,
      altRef: oneThousandsGenomes.an,
      homozygotes: oneThousandsGenomes.hom,
      frequency: toExponentialNotation(oneThousandsGenomes.af),
    },
  ].map((row, index) => ({ ...row, key: `${index}` }));
};

const FrequencyPanel = ({ hash, className = "" }: OwnProps) => {
  const { loading, data, error } = useTabFrequenciesData(hash);

  if (error) {
    return <ServerError />;
  }

  const externalCohortsRows = makeRowFromFrequencies(
    data.frequencies,
    data.locus
  );
  const hasEmptyCohorts = isExternalCohortsTableEmpty(externalCohortsRows);

  return (
    <StackLayout className={cx(styles.frequencyPanel, className)} vertical>
      <Space direction="vertical" size={12}>
        <Spin spinning={loading}>
          <Card
            title={intl.get(
              "screen.variantDetails.summaryTab.externalCohortsTable.title"
            )}
          >
            {!hasEmptyCohorts ? (
              <Table
                size="small"
                dataSource={externalCohortsRows}
                columns={cohortsColumns}
                pagination={false}
              />
            ) : (
              <NoData />
            )}
          </Card>
        </Spin>
      </Space>
    </StackLayout>
  );
};

export default FrequencyPanel;
