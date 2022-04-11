export interface IStatistics {
  families: number;
  fileSize: string;
  files: number;
  participants: number;
  samples: number;
  studies: number;
}

export interface ArrangerSingleColumnState {
  accessor: string;
  canChangeShow: boolean;
  field: string;
  jsonPath: string | null;
  query: string | null;
  show: boolean;
  sortable: boolean;
  type: string;
}

export interface ArrangerColumnStateResults {
  data: {
    [index: string]: {
      columnsState: {
        state: {
          columns: ArrangerSingleColumnState[];
          keyField?: string;
          type: string;
        };
      };
    };
  };
}
