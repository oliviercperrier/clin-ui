import React, { FunctionComponent } from "react";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { GenomicFeatureType, SearchText } from "store/graphql/variants/models";

import style from "./index.module.scss";

const GENOMIC_TYPE_TO_SQUARE_ABBREVIATION = {
  [GenomicFeatureType.Variant]: { label: "VR" },
  [GenomicFeatureType.GENE]: { label: "GN" },
};

const GENOMIC_TYPE_TO_SQUARE_CSS = {
  [GenomicFeatureType.Variant]: style.leftSquareBgColorVariant,
  [GenomicFeatureType.GENE]: style.leftSquareBgColorGene,
};

type OwnProps = {
  matchedText: SearchText;
  displayName: string;
  type: GenomicFeatureType;
};

const SuggestionOption: FunctionComponent<OwnProps> = (props) => {
  const { displayName, type, matchedText } = props;
  return (
    <StackLayout>
      <div
        className={`${style.leftSquare} ${GENOMIC_TYPE_TO_SQUARE_CSS[type]}`}
      >
        {GENOMIC_TYPE_TO_SQUARE_ABBREVIATION[type].label}
      </div>
      <StackLayout vertical className={style.detailsContainer}>
        <div className={style.displayName}>{displayName}</div>
        <div>{matchedText}</div>
      </StackLayout>
    </StackLayout>
  );
};

export default SuggestionOption;