import React from 'react';
import { patientsColumns } from './patientsColumns';
import Table, { Props } from './Table';

const PatientsTable = ({ pagination, results, total }: Props): React.ReactElement => {
  const columns = patientsColumns([]);
  return <Table columns={columns} pagination={pagination} results={results} total={total} />;
};

export default PatientsTable;
