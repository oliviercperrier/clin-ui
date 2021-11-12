/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-curly-spacing */

import React, { useState } from "react";
import { ISyntheticSqon } from "@ferlab/ui/core/data/sqon/types";
import { VariantPageResults } from "./VariantPageContainer";
import intl from "react-intl-universal";
import { Table } from "antd";

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

const GeneTableContainer = (props: OwnProps) => {
  const { results, setCurrentPageCb, currentPageSize, setcurrentPageSize } =
    props;
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const total = 0;

  const columns = [
    {
      title: intl.get("screen.patientvariant.results.gene.table.symbol"),
      dataIndex: "test1",
    },
    {
      title: intl.get("screen.patientvariant.results.gene.table.name"),
      dataIndex: "test2",
    },
    {
      title: intl.get("screen.patientvariant.results.gene.table.omim_id"),
      dataIndex: "test3",
    },
  ];

  return (
    <>
      <div className={style.tabletotalTitle}>
        Résultats <strong>1 - {DEFAULT_PAGE_SIZE}</strong> sur{" "}
        <strong>{total}</strong>
      </div>
      <Table
        columns={columns}
        className={style.variantSearchTable}
        pagination={{
          current: currentPageNum,
          showTotal: () => undefined,
          showTitle: false,
          showSizeChanger: true,
          showQuickJumper: false,
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

export default GeneTableContainer;
