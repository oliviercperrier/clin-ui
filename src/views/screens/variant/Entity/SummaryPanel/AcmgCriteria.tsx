import { Space, Spin, Table, Tag, Typography } from 'antd';
import intl from 'react-intl-universal';
import { VariantEntity } from 'graphql/variants/models';
import CollapsePanel from 'components/containers/collapse';
import NoData from '../NoData';

const { Title } = Typography;

const getCriteriaTagColor = (criteria: string) => {
  switch (criteria.toLowerCase().substring(0, 2)) {
    case 'pv':
    case 'ps':
      return 'red';
    case 'pm':
      return 'volcano';
    case 'pp':
      return 'gold';
    case 'bs':
    case 'ba':
      return 'green';
    case 'bp':
      return 'blue';
    default:
      return 'default';
  }
};

const columns = [
  {
    title: () => intl.get('screen.variantDetails.summaryTab.acmgCriteriaTable.criteriaColumn'),
    dataIndex: 'name',
    width: '18%',
    render: (name: string) => <Tag color={getCriteriaTagColor(name)}>{name}</Tag>,
  },
  {
    title: () => intl.get('screen.variantDetails.summaryTab.acmgCriteriaTable.explanationColumn'),
    dataIndex: 'user_explain',
    render: (user_explain: string[]) => (
      <Space direction="vertical" size={4}>
        {user_explain}
      </Space>
    ),
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
            dataSource={formattedDate}
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
