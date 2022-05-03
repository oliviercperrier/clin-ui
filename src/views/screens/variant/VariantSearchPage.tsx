import React from 'react';
import intl from 'react-intl-universal';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import { FilterInfo, SUGGESTION_TYPE } from 'views/screens/variant/filters/types';
import { Layout } from 'antd';
import FilterList from 'views/screens/variant/filters/FilterList';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import LineStyleIcon from 'components/icons/LineStyleIcon';
import GeneIcon from 'components/icons/GeneIcon';
import DiseaseIcon from 'components/icons/DiseaseIcon';
import FrequencyIcon from 'components/icons/FrequencyIcon';
import OccurenceIcon from 'components/icons/OccurenceIcon';
import RqdmIcon from 'components/icons/RqdmIcon';
import VariantPageContainer from 'views/screens/variant/VariantPageContainer';
import { Spin } from 'antd';
import { MappingResults, useGetVariantExtendedMappings } from 'graphql/variants/actions';
import { VARIANT_QB_ID } from './constants';

import styles from './VariantSearchPage.module.scss';

enum FilterTypes {
  Rqdm,
  Variant,
  Gene,
  Pathogenicity,
  Frequency,
  Occurrence,
}

const filterGroups: {
  [type: string]: FilterInfo;
} = {
  [FilterTypes.Rqdm]: {
    groups: [
      {
        title: 'screen.patientvariant.filter.grouptitle.genepanel',
        fields: ['panels'],
      },
    ],
  },
  [FilterTypes.Variant]: {
    groups: [
      {
        fields: [
          'variant_class',
          'consequences__consequences',
          'variant_external_reference',
          'chromosome',
          'start',
        ],
      },
    ],
    suggester: {
      suggestionType: SUGGESTION_TYPE.VARIANTS,
      title: () => intl.get('filter.suggester.search.variants'),
      placeholder: () => 'e.g. 10-100063679-T-C, rs341',
      tooltipTitle: () => intl.get('filter.suggester.search.variants.tooltip'),
    },
  },
  [FilterTypes.Gene]: {
    groups: [
      {
        fields: [
          'consequences__biotype',
          'gene_external_reference',
          'genes__hpo__hpo_term_label',
          'genes__orphanet__panel',
          'genes__omim__name',
          'genes__ddd__disease_name',
          'genes__cosmic__tumour_types_germline',
        ],
      },
    ],
    suggester: {
      suggestionType: SUGGESTION_TYPE.GENES,
      title: () => intl.get('filter.suggester.search.genes'),
      placeholder: () => 'e.g. BRAF, ENSG00000157764',
      tooltipTitle: () => intl.get('filter.suggester.search.genes.tooltip'),
    },
  },
  [FilterTypes.Pathogenicity]: {
    groups: [
      {
        fields: [
          'clinvar__clin_sig',
          'varsome__acmg__verdict__verdict',
          'varsome__acmg__classifications__name',
          'consequences__vep_impact',
        ],
      },
      {
        title: 'predictions',
        fields: [
          'consequences__predictions__sift_pred',
          'consequences__predictions__polyphen2_hvar_pred',
          'consequences__predictions__fathmm_pred',
          'consequences__predictions__cadd_score',
          'consequences__predictions__dann_score',
          'consequences__predictions__lrt_pred',
          'consequences__predictions__revel_rankscore',
        ],
      },
    ],
  },
  [FilterTypes.Frequency]: {
    groups: [
      {
        title: 'screen.patientvariant.filter.grouptitle.rqdmpatient',
        fields: [
          'frequency_RQDM__total__af',
          'frequency_RQDM__affected__af',
          'frequency_RQDM__non_affected__af',
        ],
      },
      {
        title: 'screen.patientvariant.filter.grouptitle.publiccohorts',
        fields: [
          'external_frequencies__gnomad_genomes_2_1_1__af',
          'external_frequencies__gnomad_genomes_3_0__af',
          'external_frequencies__gnomad_genomes_3_1_1__af',
          'external_frequencies__gnomad_exomes_2_1_1__af',
          'external_frequencies__topmed_bravo__af',
          'external_frequencies__thousand_genomes__af',
        ],
      },
    ],
  },
  [FilterTypes.Occurrence]: {
    groups: [
      {
        fields: [
          'donors__zygosity',
          'donors__transmission',
          'donors__parental_origin',
          'donors__is_hc',
          'donors__is_possibly_hc',
        ],
      },
      {
        title: 'screen.patientvariant.category_metric',
        fields: [
          'donors__filters',
          'donors__qd',
          'donors__ad_alt',
          'donors__ad_total',
          'donors__ad_ratio',
          'donors__gq',
        ],
      },
    ],
  },
};

const filtersContainer = (mappingResults: MappingResults, type: FilterTypes): React.ReactNode => {
  if (mappingResults.loadingMapping) {
    return <Spin className={styles.filterLoader} spinning />;
  }

  return (
    <FilterList
      key={type}
      queryBuilderId={VARIANT_QB_ID}
      mappingResults={mappingResults}
      filterInfo={filterGroups[type]}
    />
  );
};

const VariantSearchPage = (): React.ReactElement => {
  const variantMappingResults = useGetVariantExtendedMappings();
  const menuItems: ISidebarMenuItem[] = [
    {
      key: '1',
      title: intl.get('screen.patientvariant.category_rqdm'),
      icon: <RqdmIcon className={styles.sideMenuIcon} />,
      panelContent: filtersContainer(variantMappingResults, FilterTypes.Rqdm),
    },
    {
      key: '2',
      title: intl.get('screen.patientvariant.category_variant'),
      icon: <LineStyleIcon className={styles.sideMenuIcon} />,
      panelContent: filtersContainer(variantMappingResults, FilterTypes.Variant),
    },
    {
      key: '3',
      title: intl.get('screen.patientvariant.category_genomic'),
      icon: <GeneIcon className={styles.sideMenuIcon} />,
      panelContent: filtersContainer(variantMappingResults, FilterTypes.Gene),
    },
    {
      key: '4',
      title: intl.get('screen.patientvariant.category_cohort'),
      icon: <FrequencyIcon className={styles.sideMenuIcon} />,
      panelContent: filtersContainer(variantMappingResults, FilterTypes.Frequency),
    },
    {
      key: '5',
      title: intl.get('screen.patientvariant.category_pathogenicity'),
      icon: <DiseaseIcon className={styles.sideMenuIcon} />,
      panelContent: filtersContainer(variantMappingResults, FilterTypes.Pathogenicity),
    },
    {
      key: '6',
      title: intl.get('screen.patientvariant.category_occurrence'),
      icon: <OccurenceIcon className={styles.sideMenuIcon} />,
      panelContent: filtersContainer(variantMappingResults, FilterTypes.Occurrence),
    },
  ];

  return (
    <Layout className={styles.patientVariantLayout}>
      <SidebarMenu className={styles.patientVariantSideMenu} menuItems={menuItems} />
      <ScrollView className={styles.scrollContent}>
        <StackLayout vertical className={styles.pageContainer}>
          <VariantPageContainer mappingResults={variantMappingResults} />
        </StackLayout>
      </ScrollView>
    </Layout>
  );
};
export default VariantSearchPage;
