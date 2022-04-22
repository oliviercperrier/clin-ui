import { useState } from 'react';
import { Tooltip } from 'antd';
import cx from 'classnames';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { VariantPageResults } from './VariantPageContainer';
import intl from 'react-intl-universal';
import UserAffected from 'components/icons/UserAffectedIcon';
import {
  VariantEntity,
  ClinVar,
  Consequence,
  ExternalFrequenciesEntity,
  DonorsEntity,
  frequency_RQDMEntity,
  ITableVariantEntity,
} from 'graphql/variants/models';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'views/screens/variant/constants';
import ConsequencesCell from './ConsequencesCell';
import { ArrangerResultsTree, ArrangerEdge } from 'graphql/models';
import { navigateTo } from 'utils/helper';
import OccurrenceDrawer from './OccurrenceDrawer';
import { Varsome, VarsomeClassifications } from 'graphql/variants/models';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { getProTableDictionary } from 'utils/translation';

import style from './VariantTableContainer.module.scss';

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;

type OwnProps = {
  results: VariantPageResults;
  filters: ISyntheticSqon;
  setCurrentPageCb: (currentPage: number) => void;
  currentPageSize: number;
  setcurrentPageSize: (currentPage: number) => void;
  patientId: string;
};

const makeRows = (rows: ArrangerEdge<VariantEntity>[]) =>
  rows.map((row: ArrangerEdge<VariantEntity>, index: number) => ({
    ...row.node,
    key: `${index}`,
  }));

const findDonorById = (donors: ArrangerResultsTree<DonorsEntity>, patientId: string) => {
  return donors.hits?.edges.find((donor) => donor.node.patient_id === patientId);
};

const formatCalls = (calls: number[]) => (calls ? calls.join('/') : DISPLAY_WHEN_EMPTY_DATUM);

const formatRqdm = (rqdm: frequency_RQDMEntity) => {
  if (!rqdm?.total?.pc) {
    return DISPLAY_WHEN_EMPTY_DATUM;
  }
  return `${rqdm.total.pc} / ${rqdm.total.pn} (${(rqdm.total.pf * 100).toPrecision(3)}%)`;
};

const getVariantColumns = (
  patientId: string,
  drawerCb: (record: VariantEntity) => void,
): ProColumnType<ITableVariantEntity>[] => [
  {
    title: intl.get('screen.patientvariant.results.table.variant'),
    key: 'hgvsg',
    dataIndex: 'hgvsg',
    className: cx(style.variantTableCell, style.variantTableCellElipsis),
    render: (hgvsg: string, entity: VariantEntity) =>
      hgvsg ? (
        <Tooltip placement="topLeft" title={hgvsg}>
          <a onClick={() => navigateTo(`/variant/entity/${entity.hash}?patientid=${patientId}`)}>
            {hgvsg}
          </a>
        </Tooltip>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
  },
  {
    key: 'variant_class',
    title: intl.get('screen.patientvariant.results.table.type'),
    dataIndex: 'variant_class',
  },
  {
    key: 'rsnumber',
    title: intl.get('screen.patientvariant.results.table.dbsnp'),
    dataIndex: 'rsnumber',
    className: style.dbSnpTableCell,
    render: (rsNumber: string) =>
      rsNumber ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`}
        >
          {rsNumber}
        </a>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
  },
  {
    key: 'consequences',
    title: intl.get('screen.patientvariant.results.table.consequence'),
    dataIndex: 'consequences',
    width: 300,
    render: (consequences: { hits: { edges: Consequence[] } }) => (
      <ConsequencesCell consequences={consequences?.hits?.edges || []} />
    ),
  },
  {
    key: 'clinvar',
    title: intl.get('screen.patientvariant.results.table.clinvar'),
    dataIndex: 'clinvar',
    className: cx(style.variantTableCell, style.variantTableCellElipsis),
    render: (clinVar: ClinVar) =>
      clinVar?.clin_sig && clinVar.clinvar_id ? (
        <a
          href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clinvar_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {clinVar.clin_sig.join(', ')}
        </a>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
  },
  {
    key: 'varsome',
    title: intl.get('screen.patientvariant.results.table.varsome'),
    dataIndex: 'varsome',
    className: cx(style.variantTableCell, style.variantTableCellElipsis),
    render: (varsome: Varsome) => (
      <a
        href={`https://varsome.com/variant/${varsome?.variant_id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {varsome?.acmg.verdict.verdict ? varsome?.acmg.verdict.verdict : 'No Verdict'}
      </a>
    ),
  },
  {
    key: 'varsome',
    title: intl.get('screen.patientvariant.results.table.acmgRules'),
    dataIndex: 'varsome',
    className: cx(style.variantTableCell, style.variantTableCellElipsis),
    render: (varsome: Varsome) =>
      varsome?.acmg.classifications.hits.edges
        .map((e: ArrangerEdge<VarsomeClassifications>) => e.node.name)
        .reduce((prev, curr) => `${prev}, ${curr}`),
  },
  {
    key: 'external_frequencies',
    title: intl.get('screen.variantsearch.table.gnomAd'),
    dataIndex: 'external_frequencies',
    render: (external_frequencies: ExternalFrequenciesEntity) =>
      external_frequencies.gnomad_exomes_2_1_1
        ? external_frequencies.gnomad_exomes_2_1_1.af.toPrecision(4)
        : DISPLAY_WHEN_EMPTY_DATUM,
  },
  {
    key: 'rqdm',
    title: intl.get('screen.patientvariant.results.table.rqdm'),
    render: (record: VariantEntity) => formatRqdm(record.frequency_RQDM),
  },
  {
    key: 'donors_zygosity',
    title: intl.get('screen.patientvariant.results.table.zygosity'),
    dataIndex: 'donors',
    render: (record: ArrangerResultsTree<DonorsEntity>) => {
      const donor = findDonorById(record, patientId);
      return donor ? donor.node?.zygosity : DISPLAY_WHEN_EMPTY_DATUM;
    },
  },
  {
    key: 'donors_genotype',
    title: intl.get('screen.patientvariant.results.table.genotype'),
    dataIndex: 'donors',
    render: (record: ArrangerResultsTree<DonorsEntity>) => {
      const donor = findDonorById(record, patientId);
      const motherCalls = formatCalls(donor?.node.mother_calls!);
      const fatherCalls = formatCalls(donor?.node.father_calls!);

      return `${motherCalls} : ${fatherCalls}`;
    },
  },
  {
    className: style.userAffectedBtnCell,
    key: 'drawer',
    displayTitle: 'Information',
    render: (record: VariantEntity) => {
      return (
        <UserAffected
          onClick={() => drawerCb(record)}
          width="16"
          height="16"
          className={style.affectedIcon}
        />
      );
    },
    align: 'center',
  },
];

const VariantTableContainer = (props: OwnProps) => {
  const [drawerOpened, toggleDrawer] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantEntity | undefined>(undefined);
  const { results, setCurrentPageCb, currentPageSize, setcurrentPageSize } = props;
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);

  const variantsResults = results.data?.Variants as ArrangerResultsTree<VariantEntity>;
  const variants = variantsResults?.hits?.edges || [];
  const total = variantsResults?.hits?.total || 0;
  const rows = makeRows(variants);

  return (
    <>
      <ProTable<ITableVariantEntity>
        tableId="varirant_table"
        className={style.variantSearchTable}
        columns={getVariantColumns(props.patientId, (record) => {
          setSelectedVariant(record);
          toggleDrawer(true);
        })}
        dataSource={rows}
        loading={results.loading}
        dictionary={getProTableDictionary()}
        onChange={({ current, pageSize }) => {
          if (currentPageNum !== current || currentPageSize !== pageSize) {
            setCurrentPageNum(current!);
            setCurrentPageCb(current!);
            setcurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
          }
        }}
        headerConfig={{
          itemCount: {
            pageIndex: currentPageNum,
            pageSize: currentPageSize,
            total: total || 0,
          },
        }}
        size="small"
        pagination={{
          current: currentPageNum,
          pageSize: currentPageSize,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          total: total ?? 0,
        }}
      />
      {rows?.length > 0 && selectedVariant && (
        <OccurrenceDrawer
          patientId={props.patientId}
          data={selectedVariant}
          opened={drawerOpened}
          toggle={toggleDrawer}
        />
      )}
    </>
  );
};

export default VariantTableContainer;
