import React from 'react';
import cx from 'classnames';
import intl from 'react-intl-universal';
import { useTabClinicalData } from 'graphql/variants/tabActions';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import ServerError from 'components/Results/ServerError';
import { Card, Space, Table, Spin } from 'antd';
import NoData from 'views/screens/variant/Entity/NoData';
import { makeClinVarRows, makeGenesOrderedRow } from './utils';
import { columnsClinVar, columnsPhenotypes } from './columns';

import styles from './index.module.scss';

interface OwnProps {
  className?: string;
  hash: string;
}

const ClinicalPanel = ({ hash, className = '' }: OwnProps) => {
  const { loading, data, error } = useTabClinicalData(hash);

  if (error) {
    return <ServerError />;
  }

  const dataClinvar = data?.clinvar || {};
  const clinvarId = dataClinvar.clinvar_id;
  const dataGenes = data?.genes || {};

  const clinVarRows = makeClinVarRows(dataClinvar);
  const clinVarHasRows = clinVarRows.length > 0;

  const genesRows = makeGenesOrderedRow(dataGenes);
  const genesHasRows = genesRows.length > 0;

  return (
    <div className={cx(styles.clinicalPanelWrapper, className)}>
      <Space direction="vertical" className={styles.clinicalPanel} size={12}>
        <Spin spinning={loading}>
          <Card
            title={
              <span>
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
              </span>
            }
          >
            {clinVarHasRows ? (
              <Table
                pagination={false}
                dataSource={clinVarRows}
                columns={columnsClinVar}
                bordered
              />
            ) : (
              <NoData />
            )}
          </Card>
        </Spin>
        <Spin spinning={loading}>
          <Card title={intl.get('screen.variantDetails.clinicalAssociationsTab.genePhenotype')}>
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
          </Card>
        </Spin>
      </Space>
    </div>
  );
};

export default ClinicalPanel;
