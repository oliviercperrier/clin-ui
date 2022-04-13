export {};

export interface IHpoNode {
  hpo_id: string;
  is_leaf: boolean;
  name: string;
  parents: string[];
}

export interface IHpoChild {
  _source: IHpoNode;
}

export interface IHpoPayload {
  data: {
    hits: IHpoChild[];
    total: number;
  };
}
