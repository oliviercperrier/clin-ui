import { gql } from "@apollo/client";
import { ISyntheticSqon } from "@ferlab/ui/core/data/sqon/types";

export type Sort = {
  field: string;
  order: string;
};

export type QueryVariable = {
  sqon: ISyntheticSqon;
  first?: number;
  offset?: number;
  sort?: Sort[];
  pageSize?: number;
};

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
query ExtendedMapping {
  ${index} {
    extended
  }
}
`;
