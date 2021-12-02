export interface FilterGroup {
  title?: string;
  fields: string[];
}

export interface FilterInfo {
  groups: FilterGroup[];
  suggester?: {
    title: () => string;
    placeholder: () => string;
    suggestionType: SUGGESTION_TYPE;
    tooltipTitle: () => string;
  };
}

export enum SUGGESTION_TYPE {
    VARIANTS = "variants",
    GENES = "genes"
}