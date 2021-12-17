import React from "react";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import {
  OrphanetCondition,
  OrphanetConditions,
} from "store/graphql/variants/models";

interface OwnProps {
  conditions: OrphanetConditions;
}

const OrphanetConditionCell = ({ conditions }: OwnProps) => (
  <div>
    {conditions.length > 0 &&
      conditions.map((orphanetItem: OrphanetCondition, index: number) => {
        const panel = orphanetItem.panel;
        const disorderId = orphanetItem.disorderId;
        return (
          <StackLayout key={index}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                "https://www.orpha.net/consor/cgi-bin/Disease_Search.php" +
                `?lng=EN&data_id=${disorderId}`
              }
            >
              {panel}
            </a>
          </StackLayout>
        );
      })}
  </div>
);

export default OrphanetConditionCell;
