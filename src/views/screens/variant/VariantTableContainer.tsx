/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-curly-spacing */

import React, { useState } from "react";
import { Table } from "antd";
import { ISyntheticSqon } from "@ferlab/ui/core/data/sqon/types";
import { VariantPageResults } from "./VariantPageContainer";
import intl from "react-intl-universal";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import {
  VariantEntity,
  ClinVar,
  Consequence,
  ESResult,
  ESResultNode,
  FrequenciesEntity,
  DonorsEntity,
} from "store/graphql/variants/models";
import { DISPLAY_WHEN_EMPTY_DATUM } from "./Empty";
import ConsequencesCell from "./ConsequencesCell";

import style from "./VariantTableContainer.module.scss";

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;

type OwnProps = {
  results: VariantPageResults;
  filters: ISyntheticSqon;
  setCurrentPageCb: (currentPage: number) => void;
  currentPageSize: number;
  setcurrentPageSize: (currentPage: number) => void;
};

const makeRows = (rows: ESResultNode<VariantEntity>[]) =>
  rows.map((row: ESResultNode<VariantEntity>, index: number) => ({
    ...row.node,
    key: `${index}`,
  }));

const columns = [
  {
    title: () => intl.get("screen.patientvariant.results.table.variant"),
    dataIndex: "hgvsg",
    render: (hgvsg: string, entity: VariantEntity) =>
      hgvsg ? (
        <Tooltip placement="topLeft" title={hgvsg}>
          <Link to={`/variant/entity/${entity.hash}`} href={"#top"}>
            {hgvsg}
          </Link>
        </Tooltip>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
  },
  {
    title: () => intl.get("screen.patientvariant.results.table.type"),
    dataIndex: "variant_class",
  },
  {
    title: () => intl.get("screen.patientvariant.results.table.dbsnp"),
    dataIndex: "rsnumber",
    render: (rsNumber: string) =>
      rsNumber ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`}
        >
          {rsNumber}
        </a>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
  },
  {
    title: () => intl.get("screen.patientvariant.results.table.consequence"),
    dataIndex: "consequences",
    width: 300,
    render: (consequences: { hits: { edges: Consequence[] } }) => (
      <ConsequencesCell consequences={consequences?.hits?.edges || []} />
    ),
  },
  {
    title: () => intl.get("screen.patientvariant.results.table.clinvar"),
    dataIndex: "clinvar",
    render: (clinVar: ClinVar) =>
      clinVar?.clin_sig && clinVar.clinvar_id ? (
        <a
          href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clinvar_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {clinVar.clin_sig.join(", ")}
        </a>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
  },
  {
    title: () => intl.get("screen.variantsearch.table.gnomAd"),
    dataIndex: "frequencies",
    render: (frequencies: FrequenciesEntity) =>
      frequencies.gnomad_exomes_2_1_1
        ? frequencies.gnomad_exomes_2_1_1.af
        : DISPLAY_WHEN_EMPTY_DATUM,
  },
  {
    title: () => intl.get("screen.patientvariant.results.table.rqdm"),
    dataIndex: "donors",
    render: (donors: ESResult<DonorsEntity>) => donors.hits.total,
  },
  {
    title: () => intl.get("screen.patientvariant.results.table.zygosity"),
    dataIndex: "test8",
    render: () => DISPLAY_WHEN_EMPTY_DATUM,
  },
  {
    title: () => intl.get("screen.patientvariant.results.table.transmission"),
    dataIndex: "test9",
    render: () => DISPLAY_WHEN_EMPTY_DATUM,
  },
];

const VariantTableContainer = (props: OwnProps) => {
  const { results, setCurrentPageCb, currentPageSize, setcurrentPageSize } =
    props;
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);

  const variantsResults = results.data?.Variants as ESResult<VariantEntity>;
  const variants = variantsResults?.hits?.edges || [];
  const total = variantsResults?.hits?.total || 0;

  return (
    <>
      <div className={style.tabletotalTitle}>
        Résultats <strong>1 - {DEFAULT_PAGE_SIZE}</strong> sur{" "}
        <strong>{total}</strong>
      </div>
      <Table
        size="small"
        loading={results.loading}
        columns={columns}
        dataSource={makeRows(variants)}
        className={style.variantSearchTable}
        pagination={{
          current: currentPageNum,
          showTotal: () => undefined,
          total: total,
          showTitle: false,
          showSizeChanger: true,
          showQuickJumper: false,
          defaultPageSize: currentPageSize,
          onChange: (page, pageSize) => {
            if (currentPageNum !== page || currentPageSize !== pageSize) {
              setCurrentPageNum(page);
              setCurrentPageCb(page);
              setcurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
            }
          },
          size: "small",
        }}
      />
    </>
  );
};

export default VariantTableContainer;
