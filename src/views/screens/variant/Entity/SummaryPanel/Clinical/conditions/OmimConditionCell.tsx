import React from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'views/screens/variant/constants';
import { OmimConditions, OmimCondition } from 'graphql/variants/models';
import { Typography } from 'antd';

interface OwnProps {
  conditions: OmimConditions;
}

const { Text } = Typography;

const OmimConditionCell = ({ conditions }: OwnProps) => (
  <div>
    {conditions.length >= 0 &&
      conditions.map((omimCondition: OmimCondition, index: number) => {
        const geneOmimName = omimCondition.omimName || DISPLAY_WHEN_EMPTY_DATUM;
        const omimId = omimCondition.omimId;

        return (
          <StackLayout key={index}>
            <Text>{geneOmimName}</Text>&nbsp;(MIM:
            <a
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.omim.org/entry/${omimId}`}
            >
              {omimId}
            </a>
            )
          </StackLayout>
        );
      })}
  </div>
);

export default OmimConditionCell;
