import React from 'react';
import {
  HcComplement,
  HcComplementHits,
  PossiblyHcComplement,
  PossiblyHcComplementHits,
} from 'store/graphql/variants/models';
import { Space, Tooltip, Typography } from 'antd';
import { extractHits } from 'store/graphql/utils/query';
import { createQueryParams } from '@ferlab/ui/core/data/filters/utils';
import { generateFilters, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';

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
  return -1;
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
            <Link
              //style vs classname: for some reasons, cannot use classname (possibly problem with bridging of the apps)
              style={{ textDecoration: 'underline' }}
              to={{
                search: createQueryParams({
                  filters: generateFilters({
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
                }),
              }}
            >
              <Text>( {getCount(e)} )</Text>
            </Link>
            {!isLastItem(index, nOfSymbols) && ','}
          </Tooltip>
        </Space>
      ))}
    </Space>
  );
};
