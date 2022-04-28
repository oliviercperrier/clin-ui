import intl from 'react-intl-universal';
import { useTabClinicalData } from 'graphql/variants/tabActions';
import ServerError from 'components/Results/ServerError';
import { Space, Table, Spin, Typography } from 'antd';
import NoData from 'views/screens/variant/Entity/NoData';
import { makeClinVarRows, makeGenesOrderedRow } from './utils';
import { columnsClinVar, columnsPhenotypes } from './columns';
import CollapsePanel from 'components/containers/collapse';

import styles from './index.module.scss';

interface OwnProps {
  hash: string;
}

const { Title } = Typography;

const ClinicalCard = ({ hash }: OwnProps) => {
  const { loading, data } = useTabClinicalData(hash);

  const dataClinvar = data?.clinvar || {};
  const clinvarId = dataClinvar.clinvar_id;
  const dataGenes = data?.genes || {};

  const clinVarRows = makeClinVarRows(dataClinvar);
  const clinVarHasRows = clinVarRows.length > 0;

  const genesRows = makeGenesOrderedRow(dataGenes);
  const genesHasRows = genesRows.length > 0;

  return (
    <Space direction="vertical" className={styles.clinicalCard} size={16}>
      <Spin spinning={loading}>
        <CollapsePanel
          header={
            <Title level={4}>
              ClinVar{' '}
              {clinvarId ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinvarId}`}
                >
                  {clinvarId}
                </a>
              ) : (
                ''
              )}
            </Title>
          }
        >
          {clinVarHasRows ? (
            <Table
              pagination={false}
              dataSource={clinVarRows}
              columns={columnsClinVar}
              bordered
              size="small"
            />
          ) : (
            <NoData />
          )}
        </CollapsePanel>
      </Spin>
      <Spin spinning={loading}>
        <CollapsePanel
          header={
            <Title level={4}>
              {intl.get('screen.variantDetails.clinicalAssociationsTab.genePhenotype')}
            </Title>
          }
        >
          {genesHasRows ? (
            <Table
              bordered
              pagination={false}
              dataSource={genesRows}
              columns={columnsPhenotypes}
              size="small"
            />
          ) : (
            <NoData />
          )}
        </CollapsePanel>
      </Spin>
    </Space>
  );
};

export default ClinicalCard;
