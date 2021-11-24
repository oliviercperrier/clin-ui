import React, { FunctionComponent } from "react";
import {
  getQueryBuilderCache,
  useFilters,
} from "@ferlab/ui/core/data/filters/utils";
import { resolveSyntheticSqon } from "@ferlab/ui/core/data/sqon/utils";
import { Layout, Spin } from "antd";
import { cloneDeep } from "lodash";
import { useParams } from "react-router";

import { generateFilters } from "store/graphql/utils/Filters";
import {
  VARIANT_INDEX,
  VARIANT_REPO_CACHE_KEY,
} from "views/screens/variant/constants";
import {
  MappingResults,
  useGetVariantAggregations,
} from "store/graphql/variants/actions";
import { VARIANT_AGGREGATION_QUERY } from "store/graphql/variants/queries";

import styles from "./Filters.module.scss";

type OwnProps = {
  field: string;
  mappingResults: MappingResults;
};

const GenericFilters: FunctionComponent<OwnProps> = ({
  field,
  mappingResults,
}) => {
  const { filters } = useFilters();
  const { patientid } = useParams<{ patientid: string }>();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let resolvedSqon = cloneDeep(resolveSyntheticSqon(allSqons, filters));
  resolvedSqon.content.push({
    content: { field: "donors.patient_id", value: [patientid] },
    op: "in",
  });

  let results = useGetVariantAggregations(
    {
      sqon: resolvedSqon,
    },
    VARIANT_AGGREGATION_QUERY([field], mappingResults)
  );

  return (
    <Spin size="large" spinning={results.loading}>
      <Layout
        className={`${styles.variantFilterWrapper} ${styles.genericFilterWrapper}`}
      >
        {generateFilters(
          results?.aggregations,
          {
            loading: mappingResults.loadingMapping,
            data: mappingResults.extendedMapping,
          },
          styles.variantFilterContainer,
          true,
          true,
          true,
          true
        )}
      </Layout>
    </Spin>
  );
};

export default GenericFilters;
