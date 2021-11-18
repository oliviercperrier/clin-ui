import React from "react";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { Space, Typography, Tag, Tabs, Skeleton } from "antd";
import intl from "react-intl-universal";
import BarChartIcon from "components/icons/BarChartIcon";
import StockIcon from "components/icons/StockIcon";
import LibraryIcon from "components/icons/LibraryIcon";
import { useGetPageData } from "store/graphql/utils/actions";
import { VARIANT_INDEX } from "views/screens/variant/constants";
import { TAB_SUMMARY_QUERY } from "store/graphql/variants/queries";
import { ESResult, VariantEntity } from "store/graphql/variants/models";

import ResumePanel from "./ResumePanel";
import { GraphqlBackend } from "store/providers";
import ApolloProvider from "store/providers/apollo";
import useQueryString from "utils/useQueryString";
import { useParams } from "react-router";

import styles from "./index.module.scss";

const getVepImpactTag = (score: number) => {
  switch (score) {
    case 1:
      return <Tag>MODIFIER</Tag>;
    case 2:
      return <Tag color="green">LOW</Tag>;
    case 3:
      return <Tag color="gold">MODERATE</Tag>;
    case 4:
      return <Tag color="red">HIGH</Tag>;

    default:
      return true;
  }
};

const VariantEntityPage = () => {
  const { hash } = useParams<{ hash: string }>();
  const results = useGetPageData(
    {
      sqon: {
        content: [
          {
            op: "in",
            content: {
              field: "hash",
              value: hash,
            },
          },
        ],
        op: "and",
      },
    },
    TAB_SUMMARY_QUERY,
    VARIANT_INDEX
  );
  const variantResults = results.data?.Variants as ESResult<VariantEntity>;
  const variantData = variantResults?.hits.edges[0].node;

  return (
    <StackLayout className={styles.variantEntity} vertical>
      <div className={styles.entityHeader}>
        <Skeleton
          title={{ width: 200 }}
          paragraph={false}
          loading={results.loading}
          className={styles.titleSkeleton}
          active
        >
          <Typography.Title className={styles.title}>
            {variantData?.hgvsg}
          </Typography.Title>
          <Tag color="purple">
            {variantData?.variant_type.toLocaleUpperCase()}
          </Tag>
          {getVepImpactTag(variantData?.max_impact_score)}
        </Skeleton>
      </div>
      <Tabs className={styles.entitySections}>
        <Tabs.TabPane
          tab={
            <span>
              <BarChartIcon height="16" width="16" />
              {intl.get("screen.variantdetails.tab.summary")}
            </span>
          }
          key="1"
        >
          <ResumePanel
            data={{
              loading: results.loading,
              variantData: variantData,
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <StockIcon height="16" width="16" />
              {intl.get("screen.variantdetails.tab.frequencies")}
            </span>
          }
          key="2"
        ></Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <LibraryIcon height="16" width="16" />
              {intl.get("screen.variantdetails.tab.clinicalAssociations")}
            </span>
          }
          key="3"
        ></Tabs.TabPane>
      </Tabs>
    </StackLayout>
  );
};

export default (props: any) => {
  const { token } = useQueryString();

  return (
    <ApolloProvider backend={GraphqlBackend.ARRANGER} token={token as string}>
      <VariantEntityPage {...props} />
    </ApolloProvider>
  );
};
