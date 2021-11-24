import React from "react";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { HpoConditions, HpoCondition } from "store/graphql/variants/models";
import { Typography } from "antd";
import ExpandableCell from "components/table/ExpandableCell";

interface OwnProps {
  conditions: HpoConditions;
}

const { Text } = Typography;

const HpoConditionCell = ({ conditions }: OwnProps) => (
  <ExpandableCell
    dataSource={conditions || []}
    renderItem={(hpoItem, id) => {
      const item = hpoItem as HpoCondition;

      const termLabel = item.hpoTermLabel || "";
      const termId = item.hpoTermTermId;

      // expects: aLabel (HP:xxxxxx)
      const split = termLabel.split("(");
      const condition = split[0];

      return (
        <StackLayout key={id}>
          <Text>{condition}</Text> &nbsp; (
          <a
            key={id}
            target="_blank"
            rel="noopener noreferrer"
            href={`https://hpo.jax.org/app/browse/term/${termId}`}
          >
            {termId}
          </a>
          )
        </StackLayout>
      );
    }}
  />
);

export default HpoConditionCell;
