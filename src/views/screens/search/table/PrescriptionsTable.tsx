import React, { useState } from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import Table, { Props } from './Table';

const PrescriptionsTable = ({ results, isLoading = false }: Props): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);
  const columns = prescriptionsColumns([]);

  return (
    <Table
      columns={columns}
      isLoading={isLoading}
      pagination={{
        current: currentPage,
        onChange: (page, _pageSize) => setCurrentPage(page),
      }}
      results={results}
      total={results?.total || 0}
    />
  );
};

export default PrescriptionsTable;
