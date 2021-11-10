import React from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import Table, { Props } from './Table';

const PrescriptionsTable = ({ pagination, results, total }: Props): React.ReactElement => {
  const columns = prescriptionsColumns([]);

  return (
    <Table
      columns={columns}
      pagination={pagination}
      results={results}
      total={total}
    />
  );
};

export default PrescriptionsTable;
