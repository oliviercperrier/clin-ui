import React from "react";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { Typography, Tag, Tabs, Skeleton } from "antd";
import intl from "react-intl-universal";
import BarChartIcon from "components/icons/BarChartIcon";
import StockIcon from "components/icons/StockIcon";
import LibraryIcon from "components/icons/LibraryIcon";
import ServerError from "components/Results/ServerError";
import NotFound from "components/Results/NotFound";

import ResumePanel from "./ResumePanel";
import { GraphqlBackend } from "store/providers";
import ApolloProvider from "store/providers/apollo";
import useQueryString from "utils/useQueryString";
import { useParams } from "react-router";

import styles from "./index.module.scss";
import { useTabSummaryData } from "store/graphql/variants/tabActions";

export const getVepImpactTag = (score: number | string) => {
  console.log()
  switch (score) {
    case 1:
    case "modifier":
      return <Tag>MODIFIER</Tag>;
    case 2:
    case "low":
      return <Tag color="green">LOW</Tag>;
    case 3:
    case "moderate":
      return <Tag color="gold">MODERATE</Tag>;
    case 4:
    case "high":
      return <Tag color="red">HIGH</Tag>;

    default:
      return true;
  }
};

const VariantEntityPage = () => {
  const { hash } = useParams<{ hash: string }>();
  const { loading, data, error } = useTabSummaryData(hash);

  if (error) {
    return <ServerError />
  }

  if (!data && !loading) {
    return <NotFound />
  }

  return (
    <StackLayout className={styles.variantEntity} vertical>
      <div className={styles.entityHeader}>
        <Skeleton
          title={{ width: 200 }}
          paragraph={false}
          loading={loading}
          className={styles.titleSkeleton}
          active
        >
          <Typography.Title className={styles.title}>
            {data?.hgvsg}
          </Typography.Title>
          <Tag color="purple">{data?.variant_type.toLocaleUpperCase()}</Tag>
          {getVepImpactTag(data?.max_impact_score)}
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
              loading: loading,
              variantData: data,
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

const EntityPage = (props: any) => {
  const { token } = useQueryString();

  return (
    <ApolloProvider backend={GraphqlBackend.ARRANGER} token={token as string}>
      <VariantEntityPage {...props} />
    </ApolloProvider>
  );
};

export default EntityPage;
