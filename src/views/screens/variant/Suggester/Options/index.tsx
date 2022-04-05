import React from "react";
import { GenomicFeatureType, Suggestion } from "graphql/variants/models";
import SuggestionOption from "./Option";

const generateDisplayName = (suggestion: Suggestion): string | undefined => {
  const type = suggestion.type;
  return type === GenomicFeatureType.GENE
    ? suggestion.symbol
    : suggestion.locus;
};

const removeSuggestionsDuplicates = (arr: Suggestion[]) =>
  arr.reduce((acc: Suggestion[], curr: Suggestion) => {
    const alreadyHasId = acc.some(
      (sugg) => sugg.suggestion_id === curr.suggestion_id
    );
    return alreadyHasId ? acc : [...acc, { ...curr }];
  }, []);

const generateSuggestionOptions = (
  searchText: string | undefined,
  suggestions: Suggestion[]
) => {
  if (!suggestions || suggestions.length === 0) {
    return [];
  }

  const suggestionsWithoutDuplicatedIds =
    removeSuggestionsDuplicates(suggestions);

  return suggestionsWithoutDuplicatedIds.map((suggestion: Suggestion): any => {
    const displayName = generateDisplayName(suggestion);
    return {
      label: (
        <SuggestionOption
          type={suggestion.type}
          key={suggestion.suggestion_id}
          matchedText={suggestion.rsnumber || suggestion.ensembl_gene_id || ""}
          displayName={displayName || "unknown"}
        />
      ),
      value: displayName,
      meta: {
        searchText,
        suggestionId: suggestion.suggestion_id,
        featureType: suggestion.type,
        geneSymbol: suggestion.symbol,
        displayName,
      },
    };
  });
};

export default generateSuggestionOptions;
