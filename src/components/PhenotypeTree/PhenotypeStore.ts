import { dotToUnderscore } from '@ferlab/ui/core/data/arranger/formatting';
import { BooleanOperators, TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { ArrangerApi } from 'api/arranger';
import OntologyTree, { lightTreeNodeConstructor, TreeNode, TTitleFormatter } from './OntologyTree';
import { IPhenotypeSource } from './types';

const ROOT_PHENO = 'All (HP:0000001)';

interface IPhenotypeQueryPayload {
  data: {
    [key: string]: {
      aggregations: Record<
        string,
        {
          buckets: IPhenotypeSource[];
        }
      >;
    };
  };
  errors?: any[];
}

export const RegexExtractPhenotype = new RegExp(/([A-Za-z].*?\((HP|MONDO):[0-9]+\))/, 'g');

export const generateNavTreeFormKey = (phenotypes: string[]): TreeNode[] => {
  if (!phenotypes.length) {
    return [];
  }

  if (phenotypes.length === 1) {
    const leafPheno = phenotypes.pop();

    if (!leafPheno) {
      return [];
    }

    return [lightTreeNodeConstructor(leafPheno)];
  }

  const rootPheno = phenotypes.pop();

  return rootPheno ? [lightTreeNodeConstructor(rootPheno, generateNavTreeFormKey(phenotypes))] : [];
};

export class PhenotypeStore {
  phenotypes: IPhenotypeSource[] = [];
  tree: TreeNode | undefined = undefined;

  fetch = async ({
    field,
    sqon,
    filterThemselves,
    titleFormatter,
  }: {
    field: string;
    sqon?: ISyntheticSqon;
    filterThemselves?: boolean;
    titleFormatter?: TTitleFormatter;
  }) => {
    this.phenotypes = [];
    this.tree = undefined;

    return this.getPhenotypes(field, sqon, filterThemselves).then((data: IPhenotypeSource[]) => {
      const ontologyTree = new OntologyTree(this.removeSingleRootNode(data), field, titleFormatter);
      this.phenotypes = ontologyTree.phenotypes;
      this.tree = ontologyTree.tree;
    });
  };

  getRootNode = () => this.tree;

  getPhenotypes = async (field: string, sqon?: ISyntheticSqon, filterThemselves = false) => {
    const body = {
      query: this.buildPhenotypeQuery(field, filterThemselves),
      variables: {
        sqon: {
          ...sqon,
          content: sqon?.content || [],
          op: sqon?.op || BooleanOperators.and,
        },
        term_filters: {
          op: BooleanOperators.and,
          content: [
            {
              op: TermOperators.in,
              content: { field: `${field}.is_tagged`, value: [true] },
            },
          ],
        },
      },
    };

    const { data, error } = await ArrangerApi.graphqlRequest<IPhenotypeQueryPayload>(body);

    if (error || data?.data.errors) {
      return [];
    }

    return data?.data.participant.aggregations[dotToUnderscore(field) + '__name'].buckets || [];
  };

  buildPhenotypeQuery = (
    field: string,
    filterThemselves: boolean,
  ) => `query($sqon: JSON, $term_filters: JSON) {
    participant {
      aggregations(
      filters: $sqon, 
      aggregations_filter_themselves: ${!filterThemselves}
      ) {
        ${dotToUnderscore(field)}__name {
          buckets{
            key,
            doc_count,
            top_hits(_source: ["${field}.parents"], size: 1)
            filter_by_term(filter: $term_filters)
          }
        }
      }
    }
  }
  `;

  removeSingleRootNode = (phenotypes: IPhenotypeSource[]) =>
    phenotypes
      .map((p) => (p.key !== ROOT_PHENO ? p : null))
      .filter((p): p is IPhenotypeSource => p !== null)
      .map((p) => {
        const index = p.top_hits.parents.indexOf(ROOT_PHENO);
        if (!index) {
          p.top_hits.parents.splice(index, 1);
        }
        return p;
      });
}
