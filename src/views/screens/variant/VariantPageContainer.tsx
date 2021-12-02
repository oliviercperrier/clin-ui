import React, { useState } from "react";
import QueryBuilder from "@ferlab/ui/core/components/QueryBuilder";
import { IDictionary } from "@ferlab/ui/core/components/QueryBuilder/types";
import {
  getQueryBuilderCache,
  useFilters,
} from "@ferlab/ui/core/data/filters/utils";
import { resolveSyntheticSqon } from "@ferlab/ui/core/data/sqon/utils";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import intl from "react-intl-universal";
import { Tabs } from "antd";
import { cloneDeep } from "lodash";

import { ExtendedMapping } from "store/graphql/models";
import {
  MappingResults,
  useGetVariantPageData,
} from "store/graphql/variants/actions";
import { VariantEntity } from "store/graphql/variants/models";

import { VARIANT_REPO_CACHE_KEY } from "./constants";
import VariantTableContainer from "./VariantTableContainer";
import GeneTableContainer from "./GeneTableContainer";
import history from "utils/history";
import { useParams } from "react-router";
import { dotToUnderscore } from "@ferlab/ui/core/data/arranger/formatting";
import GenericFilters from "./filters/GenericFilters";

import styles from "./VariantPageContainer.module.scss";

export type VariantPageContainerData = {
  mappingResults: MappingResults;
};

export type VariantPageResults = {
  data: {
    Variants: {
      hits: {
        edges: [
          {
            node: VariantEntity;
          }
        ];
        total?: number;
      };
    };
  };
  loading: boolean;
};

const DEFAULT_PAGE_NUM = 1;
export const DEFAULT_PAGE_SIZE = 20;

const VariantPageContainer = ({ mappingResults }: VariantPageContainerData) => {
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);
  const [currentPageSize, setcurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { patientid } = useParams<{ patientid: string }>();

  const { filters } = useFilters();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let resolvedSqon = cloneDeep(resolveSyntheticSqon(allSqons, filters));
  resolvedSqon.content.push({
    content: { field: "donors.patient_id", value: [patientid] },
    op: "in",
  });

  const results = useGetVariantPageData({
    sqon: resolvedSqon,
    pageSize: currentPageSize,
    offset: currentPageSize * (currentPageNum - 1),
    sort: [
      { field: "max_impact_score", order: "desc" },
      { field: "hgvsg", order: "asc" },
    ],
  });
  const [selectedFilterContent, setSelectedFilterContent] = useState<
    React.ReactElement | undefined
  >(undefined);

  const total = results.data?.Variants.hits.total || 0;

  const dictionary: IDictionary = {
    query: {
      combine: {
        and: intl.get("querybuilder.query.combine.and"),
        or: intl.get("querybuilder.query.combine.or"),
      },
      noQuery: intl.get("querybuilder.query.noQuery"),
      facet: (key) => {
        if (key === "locus") return "Variant";

        return (
          mappingResults?.extendedMapping?.find(
            (mapping: ExtendedMapping) => key === mapping.field
          )?.displayName || key
        );
      },
      //facetValueMapping: fieldMappings,
    },
    actions: {
      new: intl.get("querybuilder.actions.new"),
      addQuery: intl.get("querybuilder.actions.addQuery"),
      combine: intl.get("querybuilder.actions.combine"),
      labels: intl.get("querybuilder.actions.labels"),
      changeOperatorTo: intl.get("querybuilder.actions.changeOperatorTo"),
      delete: {
        title: intl.get("querybuilder.actions.delete.title"),
        cancel: intl.get("querybuilder.actions.delete.cancel"),
        confirm: intl.get("querybuilder.actions.delete.confirm"),
      },
      clear: {
        title: intl.get("querybuilder.actions.clear.title"),
        cancel: intl.get("querybuilder.actions.clear.cancel"),
        confirm: intl.get("querybuilder.actions.clear.confirm"),
        buttonTitle: intl.get("querybuilder.actions.clear.buttonTitle"),
        description: intl.get("querybuilder.actions.clear.description"),
      },
    },
  };

  return (
    <StackLayout vertical className={styles.variantPagecontainer}>
      <QueryBuilder
        className="patient-variant-repo__query-builder"
        headerConfig={{
          showHeader: true,
          showTools: false,
          defaultTitle: "Requête de variants",
        }}
        history={history}
        cacheKey={VARIANT_REPO_CACHE_KEY}
        enableCombine={true}
        currentQuery={filters?.content?.length ? filters : {}}
        loading={results.loading}
        total={total}
        dictionary={dictionary}
        facetFilterConfig={{
          enable: true,
          onFacetClick: (field) => {
            setSelectedFilterContent(
              <GenericFilters
                field={dotToUnderscore(field)}
                mappingResults={mappingResults}
              />
            );
          },
          selectedFilterContent: selectedFilterContent,
          blacklistedFacets: ["genes.symbol", "locus"],
        }}
      />
      <Tabs type="card" className={styles.variantTabs}>
        <Tabs.TabPane
          tab={
            intl.get("screen.patientvariant.results.table.variants") ||
            "Variants"
          }
          key="variants"
        >
          <VariantTableContainer
            results={results}
            filters={filters}
            setCurrentPageCb={setCurrentPageNum}
            currentPageSize={currentPageSize}
            setcurrentPageSize={setcurrentPageSize}
            patientId={patientid}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          disabled
          tab={intl.get("screen.patientvariant.results.table.genes") || "Genes"}
          key="genes"
        >
          <GeneTableContainer
            results={results}
            filters={filters}
            setCurrentPageCb={setCurrentPageNum}
            currentPageSize={currentPageSize}
            setcurrentPageSize={setcurrentPageSize}
          />
        </Tabs.TabPane>
      </Tabs>
    </StackLayout>
  );
};
export default VariantPageContainer;
