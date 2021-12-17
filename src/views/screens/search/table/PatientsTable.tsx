import React, { useState } from 'react';
import { patientsColumns } from './patientsColumns';
import Table, { Props } from './Table';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;

const PatientsTable = ({ results, loading = false }: Props): React.ReactElement => {
  const [currentPageSize, setcurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const columns = patientsColumns([]);

  return (
    <Table
      columns={columns}
      loading={loading}
      pagination={{
        current: currentPage,
        defaultPageSize: currentPageSize,
        onChange: (page, pageSize) => {
          if (currentPage !== page || currentPageSize !== pageSize) {
            setCurrentPage(page);
            setcurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
          }
        },
      }}
      results={results}
      total={results?.total || 0}
    />
  );
};

export default PatientsTable;
