import React from "react";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { DddConditions } from "store/graphql/variants/models";
import { Typography } from "antd";

interface OwnProps {
  conditions: DddConditions;
}

const { Text } = Typography;

const DddConditionCell = ({ conditions }: OwnProps) => (
  <div>
    {conditions.length >= 0 &&
      conditions.map((dddCondition, index: number) => (
        <StackLayout key={index}>
          <Text>{dddCondition}</Text>
        </StackLayout>
      ))}
  </div>
);

export default DddConditionCell;
