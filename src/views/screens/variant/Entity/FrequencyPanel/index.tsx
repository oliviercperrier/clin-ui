import React from 'react';
import cx from 'classnames';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabFrequenciesData } from 'store/graphql/variants/tabActions';
import intl from 'react-intl-universal';
import { Card, Table, Spin, Space } from 'antd';
import { BoundType, FrequencyByAnalysisEntity } from 'store/graphql/variants/models';
import ServerError from 'components/Results/ServerError';
import NoData from 'views/screens/variant/Entity/NoData';
import { ArrangerEdge } from 'store/graphql/models';

import styles from './index.module.scss';

interface OwnProps {
  className?: string;
  hash: string;
}

const formatFractionPercent = (nominator: number, denominator: number, total: number) => {
  return `${nominator} / ${denominator} ${
    nominator + denominator ? `(${(total * 100).toFixed(1)}%)` : ''
  }`;
};

const columns = [
  {
    title: () => intl.get('screen.variant.entity.frequencyTab.analysis'),
    dataIndex: 'analysis_code',
  },
  {
    title: () => intl.get('screen.variant.entity.frequencyTab.all.patients'),
    children: [
      {
        title: () => intl.get('screen.variant.entity.frequencyTab.frequency.abbv'),
        dataIndex: 'total',
        render: (total: BoundType) => formatFractionPercent(total?.pc, total?.pn, total?.pf),
      },
      {
        title: () => intl.get('screen.variant.entity.frequencyTab.homozygote.abbv'),
        dataIndex: 'total',
        render: (total: BoundType) => total?.hom,
      },
    ],
  },
  {
    title: () => intl.get('screen.variant.entity.frequencyTab.affected.patients'),
    children: [
      {
        title: () => intl.get('screen.variant.entity.frequencyTab.frequency.abbv'),
        dataIndex: 'affected',
        render: (affected: BoundType) =>
          formatFractionPercent(affected?.pc, affected?.pn, affected?.pf),
      },
      {
        title: () => intl.get('screen.variant.entity.frequencyTab.homozygote.abbv'),
        dataIndex: 'affected',
        render: (affected: BoundType) => affected?.hom,
      },
    ],
  },
  {
    title: () => intl.get('screen.variant.entity.frequencyTab.nonaffected.patients'),
    children: [
      {
        title: () => intl.get('screen.variant.entity.frequencyTab.frequency.abbv'),
        dataIndex: 'non_affected',
        render: (non_affected: BoundType) =>
          formatFractionPercent(non_affected?.pc, non_affected?.pn, non_affected?.pf),
      },
      {
        title: () => intl.get('screen.variant.entity.frequencyTab.homozygote.abbv'),
        dataIndex: 'non_affected',
        render: (non_affected: BoundType) => non_affected?.hom,
      },
    ],
  },
];

const makeRows = (freqByAnalysis: ArrangerEdge<FrequencyByAnalysisEntity>[]) =>
  freqByAnalysis.map((analysis) => ({
    key: analysis.node.analysis_code,
    ...analysis.node,
  }));

const FrequencyPanel = ({ hash, className = '' }: OwnProps) => {
  const { loading, data, error } = useTabFrequenciesData(hash);

  if (error) {
    return <ServerError />;
  }

  let frequencies_by_analysis = makeRows(data.frequencies_by_analysis);
  frequencies_by_analysis.push({
    analysis_code: 'RQDM',
    ...data.frequency_RQDM,
  });

  return (
    <StackLayout className={cx(styles.frequencyPanel, className)} vertical>
      <Space direction="vertical" size={12}>
        <Spin spinning={loading}>
          <Card
            title={intl.get('screen.variant.entity.frequencyTab.card.title', {
              variant: data.locus,
            })}
          >
            {true ? (
              <Table
                bordered
                size="small"
                dataSource={frequencies_by_analysis}
                columns={columns}
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
