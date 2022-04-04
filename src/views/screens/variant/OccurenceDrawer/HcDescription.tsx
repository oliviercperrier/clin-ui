import {
  HcComplement,
  HcComplementHits,
  PossiblyHcComplement,
  PossiblyHcComplementHits,
} from 'store/graphql/variants/models';
import { Button, Space, Tooltip, Typography } from 'antd';
import { extractHits } from 'store/graphql/utils/query';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import intl from 'react-intl-universal';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { VARIANT_QB_ID } from '../constants';

type Props = {
  variantId: string;
  hcComplements?: HcComplementHits | PossiblyHcComplementHits;
  defaultText: string;
};

type Complements = HcComplement | PossiblyHcComplement;

const INDEX_VARIANTS = 'Variants';

const isLastItem = (pos: number, l: number) => pos === l - 1;

const isPotential = (x: Complements) => 'count' in x;

const { Text } = Typography;

const getCount = (e: Complements) => {
  if ('locus' in e) {
    return e.locus.length;
  } else if (isPotential(e)) {
    return e.count;
  }
  // must never pass here.
  return null;
};

export const HcComplementDescription = ({ defaultText, hcComplements, variantId }: Props) => {
  const nodes = extractHits<Complements>(hcComplements?.hits);
  const nOfSymbols = nodes?.length ?? 0;
  if (!nodes || nOfSymbols === 0) {
    return <Text>{defaultText}</Text>;
  }

  return (
    <Space wrap>
      {nodes.map((e, index) => (
        <Space key={index} wrap>
          <Text>{e.symbol}</Text>
          <Tooltip
            title={intl.get('screen.patientvariant.drawer.hc.tooltip', { num: getCount(e) })}
          >
            <Button
              type="link"
              onClick={() =>
                addQuery({
                  queryBuilderId: VARIANT_QB_ID,
                  query: generateQuery({
                    newFilters: [
                      generateValueFilter({
                        field: 'genes.symbol',
                        value: [e.symbol],
                        index: INDEX_VARIANTS,
                      }),
                      generateValueFilter(
                        isPotential(e)
                          ? {
                              field: 'donors.zygosity',
                              value: ['HET'],
                              index: INDEX_VARIANTS,
                            }
                          : { field: 'hgvsg', value: [variantId], index: INDEX_VARIANTS },
                      ),
                    ],
                  }),
                  setAsActive: true,
                })
              }
            >
              <Text>( {getCount(e)} )</Text>
            </Button>
            {!isLastItem(index, nOfSymbols) && ','}
          </Tooltip>
        </Space>
      ))}
    </Space>
  );
};
