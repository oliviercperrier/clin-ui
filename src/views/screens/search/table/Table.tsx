import React from 'react';
import { Table as AntTable, TableProps } from 'antd';

import { ItemsCount } from 'components/table/ItemsCount';
import { GqlResults } from 'store/graphql/models';
import { PatientResult } from 'store/graphql/patients/models/Patient';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';

import styles from './table.module.scss';

export type Props = TableProps<any> & {
  results: GqlResults<PrescriptionResult | PatientResult> | null;
  total?: number;
  extra?: React.ReactElement;
};

const ITEM_PER_PAGE = 25;

const Table = ({
  pagination,
  results,
  total = 0,
  extra = <></>,
  ...rest
}: Props): React.ReactElement => (
  <>
    <div className={styles.tableHeader}>
      <ItemsCount page={pagination ? pagination?.current! : 1} size={ITEM_PER_PAGE} total={total} />
      {extra}
    </div>
    <AntTable
      className={styles.table}
      dataSource={results?.data || []}
      pagination={{
        ...pagination,
        pageSize: ITEM_PER_PAGE,
        position: ['bottomRight'],
        size: 'small',
      }}
      size="small"
      {...rest}
    />
  </>
);

export default Table;
