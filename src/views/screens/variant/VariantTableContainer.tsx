/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-curly-spacing */

import React, { useState } from "react";
import { Tooltip, Table } from "antd";
import { ISyntheticSqon } from "@ferlab/ui/core/data/sqon/types";
import { VariantPageResults } from "./VariantPageContainer";
import intl from "react-intl-universal";
import UserAffected from "components/icons/UserAffectedIcon";
import {
  VariantEntity,
  ClinVar,
  Consequence,
  FrequenciesEntity,
  DonorsEntity,
} from "store/graphql/variants/models";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/constants";
import ConsequencesCell from "./ConsequencesCell";
import { ArrangerResultsTree, ArrangerEdge } from "store/graphql/models";
import { navigateTo } from "utils/helper";

import style from "./VariantTableContainer.module.scss";
import OccurenceDrawer from "./OccurenceDrawer";
import { ColumnType } from "antd/lib/table";

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;

type OwnProps = {
  results: VariantPageResults;
  filters: ISyntheticSqon;
  setCurrentPageCb: (currentPage: number) => void;
  currentPageSize: number;
  setcurrentPageSize: (currentPage: number) => void;
  patientId: string;
};

const makeRows = (rows: ArrangerEdge<VariantEntity>[]) =>
  rows.map((row: ArrangerEdge<VariantEntity>, index: number) => ({
    ...row.node,
    key: `${index}`,
  }));

const VariantTableContainer = (props: OwnProps) => {
  const [drawerOpened, toggleDrawer] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorsEntity | undefined>(
    undefined
  );
  const { results, setCurrentPageCb, currentPageSize, setcurrentPageSize } =
    props;
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);

  const variantsResults = results.data
    ?.Variants as ArrangerResultsTree<VariantEntity>;
  const variants = variantsResults?.hits?.edges || [];
  const total = variantsResults?.hits?.total || 0;

  const columns: ColumnType<VariantEntity>[] = [
    {
      title: () => intl.get("screen.patientvariant.results.table.variant"),
      dataIndex: "hgvsg",
      render: (hgvsg: string, entity: VariantEntity) =>
        hgvsg ? (
          <Tooltip placement="topLeft" title={hgvsg}>
            <a onClick={() => navigateTo(`/variant/entity/${entity.hash}`)}>
              {hgvsg}
            </a>
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
      render: (donors: ArrangerResultsTree<DonorsEntity>) => donors.hits.total,
    },
    {
      title: intl.get("screen.patientvariant.results.table.zygosity"),
      dataIndex: "test8",
      render: () => DISPLAY_WHEN_EMPTY_DATUM,
    },
    {
      title: intl.get("screen.patientvariant.results.table.transmission"),
      dataIndex: "test9",
      render: () => DISPLAY_WHEN_EMPTY_DATUM,
    },
    {
      className: style.userAffectedBtnCell,
      render: (record: VariantEntity) => {
        return (
          <UserAffected
            onClick={() => {
              const donors: ArrangerEdge<DonorsEntity>[] =
                record.donors?.hits?.edges || [];
              const donor: ArrangerEdge<DonorsEntity> | undefined = donors.find(
                (donor) => donor.node.patient_id == props.patientId
              );

              setSelectedDonor(donor?.node);
              toggleDrawer(true);
            }}
            width="16"
            height="16"
            className={style.affectedIcon}
          />
        );
      },
      align: "center",
    },
  ];

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
      <OccurenceDrawer
        data={selectedDonor!}
        opened={drawerOpened}
        toggle={toggleDrawer}
      />
    </>
  );
};

export default VariantTableContainer;
