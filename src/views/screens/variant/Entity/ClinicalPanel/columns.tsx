import React from "react";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { Typography } from "antd";
import ExpandableCell from "components/table/ExpandableCell";
import intl from "react-intl-universal";
import {
  ClinicalGenesTableSource,
  Conditions,
  CosmicConditions,
  DddConditions,
  HpoConditions,
  Inheritance,
  OmimConditions,
  OmimGene,
  OmimInheritance,
  OrphanetConditions,
  OrphanetInheritance,
  SingleValuedInheritance,
} from "store/graphql/variants/models";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/constants";
import OmimConditionCell from "views/screens/variant/Entity/ClinicalPanel/conditions/OmimConditionCell";
import OrphanetConditionCell from "views/screens/variant/Entity/ClinicalPanel/conditions/OrphanetConditionCell";
import HpoConditionCell from "views/screens/variant/Entity/ClinicalPanel/conditions/HpoConditionCell";
import DddConditionCell from "views/screens/variant/Entity/ClinicalPanel/conditions/DddConditionCell";
import CosmicConditionCell from "views/screens/variant/Entity/ClinicalPanel/conditions/CosmicConditionCell";

const { Text } = Typography;

export const columnsClinVar = [
  {
    title: "Interpretation",
    dataIndex: "interpretation",
  },
  {
    title: "Condition",
    dataIndex: "condition",
    width: "25%",
  },
  {
    title: "Inheritance",
    dataIndex: "inheritance",
    width: "25%",
  },
];

type Record = {
  source: ClinicalGenesTableSource;
  gene: string | OmimGene;
  conditions: Conditions;
  inheritance: Inheritance;
};

export const columnsPhenotypes = [
  {
    title: () =>
      intl.get("screen.variantDetails.clinicalAssociationsTab.source"),
    dataIndex: "source",
  },
  {
    title: () => intl.get("screen.variantDetails.clinicalAssociationsTab.gene"),
    dataIndex: "gene",
    render: (text: Conditions, record: Record) => {
      const source = record.source;
      if (source === ClinicalGenesTableSource.omim) {
        const [geneName, omimId] = record.gene as OmimGene;
        return (
          <>
            <Text>{geneName}</Text> &nbsp; (MIM:
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.omim.org/entry/${omimId}`}
            >
              {omimId}
            </a>
            )
          </>
        );
      }
      return record.gene;
    },
  },
  {
    title: () =>
      intl.get("screen.variantDetails.clinicalAssociationsTab.condition"),
    dataIndex: "conditions",
    render: (text: Conditions, record: Record) => {
      switch (record.source) {
        case ClinicalGenesTableSource.omim:
          return (
            <OmimConditionCell
              conditions={record.conditions as OmimConditions}
            />
          );
        case ClinicalGenesTableSource.orphanet:
          return (
            <OrphanetConditionCell
              conditions={record.conditions as OrphanetConditions}
            />
          );
        case ClinicalGenesTableSource.hpo:
          return (
            <HpoConditionCell conditions={record.conditions as HpoConditions} />
          );
        case ClinicalGenesTableSource.ddd:
          return (
            <DddConditionCell conditions={record.conditions as DddConditions} />
          );
        default:
          return (
            <CosmicConditionCell
              conditions={record.conditions as CosmicConditions}
            />
          );
      }
    },
    width: "35%",
  },
  {
    title: () =>
      intl.get("screen.variantDetails.clinicalAssociationsTab.inheritance"),
    dataIndex: "inheritance",
    render: (text: Inheritance, record: Record) => {
      const source = record.source;
      if (source === ClinicalGenesTableSource.orphanet) {
        const orphanetInheritance = (record.inheritance ||
          []) as OrphanetInheritance;
        return (
          <>
            {orphanetInheritance.map((inheritance: string[], index: number) => (
              <StackLayout key={index}>
                <Text>
                  {inheritance
                    ? inheritance.join(",")
                    : DISPLAY_WHEN_EMPTY_DATUM}
                </Text>
              </StackLayout>
            ))}
          </>
        );
      } else if (source === ClinicalGenesTableSource.omim) {
        const omimInheritance = record.inheritance as OmimInheritance;
        return (
          <>
            {omimInheritance.map((inheritance: string[], index: number) => (
              <StackLayout key={index}>
                <Text>
                  {inheritance
                    ? inheritance.join(",")
                    : DISPLAY_WHEN_EMPTY_DATUM}
                </Text>
              </StackLayout>
            ))}
          </>
        );
      }
      const inheritance = record.inheritance as SingleValuedInheritance;
      return inheritance || DISPLAY_WHEN_EMPTY_DATUM;
    },
    width: "35%",
  },
];
