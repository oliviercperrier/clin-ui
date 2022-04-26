import { Spin, Table, Typography } from 'antd';
import intl from 'react-intl-universal';
import { VariantEntity } from 'graphql/variants/models';
import CollapsePanel from 'components/containers/collapse';
import NoData from '../NoData';

const { Title } = Typography;

const columns = [
  {
    title: () => intl.get('screen.variantDetails.summaryTab.acmgCriteriaTable.criteriaColumn'),
    dataIndex: 'name',
    className: ``,
    width: '18%',
  },
  {
    title: () => intl.get('screen.variantDetails.summaryTab.acmgCriteriaTable.explanationColumn'),
    dataIndex: 'user_explain',
    className: ``,
  },
];

const formatData = (data: VariantEntity | null) => {
  if (!data) return [];

  return data.varsome?.acmg?.classifications?.hits.edges.map((c) => {
    const node = c.node;
    return {
      key: node.name,
      name: node.name,
      criteria: node.met_criteria,
      user_explain: node.user_explain,
    };
  });
};

type Props = {
  data: {
    loading: boolean;
    variantData: VariantEntity | null;
  };
};

const Header = () => (
  <Title level={4}>{intl.get('screen.variantDetails.summaryTab.acmgCriteriaTitle')}</Title>
);

const ACMGCriteria = ({ data }: Props) => {
  const formattedDate = formatData(data.variantData) || [];

  return (
    <CollapsePanel header={<Header />}>
      <Spin spinning={data.loading}>
        {formattedDate.length > 0 ? (
          <Table
            bordered={true}
            dataSource={formatData(data.variantData) || []}
            columns={columns}
            pagination={false}
            size="small"
          />
        ) : (
          <NoData />
        )}
      </Spin>
    </CollapsePanel>
  );
};

export default ACMGCriteria;
