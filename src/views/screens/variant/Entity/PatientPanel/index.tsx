/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import intl from 'react-intl-universal';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabPatientData } from 'graphql/variants/tabActions';
import ServerError from 'components/Results/ServerError';
import { Card, Table, Spin, Tag, Tooltip } from 'antd';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'views/screens/variant/constants';
import { ColumnType } from 'antd/lib/table';
import { DonorsEntity, TTableDonorEntity } from 'graphql/variants/models';
import { formatTimestampToISODate } from 'utils/helper';
import { ArrangerEdge, ArrangerHits, ArrangerResultsTree } from 'graphql/models';
import { ItemsCount } from 'components/table/ItemsCount';
import { redirectParent } from 'utils/bridge';
import { ColumnFilterItem } from 'antd/lib/table/interface';

import styles from './index.module.scss';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { getProTableDictionary } from 'utils/translation';

interface OwnProps {
  className?: string;
  hash: string;
}

const DEFAULT_PAGE_SIZE = 20;

const makeRows = (donors: ArrangerEdge<DonorsEntity>[]): TTableDonorEntity[] =>
  donors?.map((donor) => ({
    key: donor.node.patient_id,
    id: donor.node.id,
    patient_id: donor.node.patient_id,
    organization_id: donor.node.organization_id,
    gender: donor.node.gender.toLowerCase(),
    is_proband: donor.node.is_proband,
    analysis_code: donor.node.analysis_code,
    analysis_display_name: donor.node.analysis_display_name,
    family_id: donor.node.family_id,
    last_update: formatTimestampToISODate(donor.node.last_update as number),
    qd: donor.node.qd,
    gq: donor.node.gq,
    filters: donor.node.filters,
    ad_alt: donor.node.ad_alt,
    ad_total: donor.node.ad_total,
    ad_ratio: donor.node.ad_ratio,
    affected_status: donor.node.affected_status,
  }));

const findAllAnalysis = (donors: ArrangerEdge<DonorsEntity>[]) => {
  let analysisList: ColumnFilterItem[] = [];
  donors.forEach((donor) => {
    if (
      donor.node.analysis_code &&
      !analysisList.find((analysis) => analysis.value === donor.node.analysis_code)
    ) {
      analysisList.push({
        value: donor.node.analysis_code,
        text: donor.node.analysis_display_name!,
      });
    }
  });
  return analysisList;
};

const getPatientPanelColumns = (
  donorsHits: ArrangerHits<DonorsEntity>,
): ProColumnType<TTableDonorEntity>[] => [
  {
    key: 'patient_id',
    dataIndex: 'patient_id',
    title: intl.get('screen.variantDetails.patientsTab.donor'),
    render: (id) => <a onClick={() => redirectParent(`/patient/${id}`)}>{id}</a>,
  },
  {
    key: 'analysis_code',
    title: intl.get('screen.variantDetails.patientsTab.analysis'),
    render: (data) =>
      data.analysis_display_name ? (
        <Tooltip title={data.analysis_display_name}>{data.analysis_code}</Tooltip>
      ) : (
        data.analysis_code
      ),
    filters: findAllAnalysis(donorsHits?.edges || []),
    onFilter: (value, record: DonorsEntity) => value === record.analysis_code,
  },
  {
    key: 'gender',
    dataIndex: 'gender',
    title: intl.get('screen.variantDetails.patientsTab.sex'),
    render: (gender: string) => intl.get(`screen.variantDetails.patientsTab.${gender}`),
    filters: [
      {
        text: intl.get('screen.variantDetails.patientsTab.male'),
        value: 'male',
      },
      {
        text: intl.get('screen.variantDetails.patientsTab.female'),
        value: 'female',
      },
      {
        text: intl.get('screen.variantDetails.patientsTab.unknown'),
        value: 'unknown',
      },
    ],
    onFilter: (value, record: DonorsEntity) => value === record.gender,
  },
  {
    key: 'is_proband',
    dataIndex: 'is_proband',
    title: intl.get('screen.variantDetails.patientsTab.relation'),
    render: (is_proband: boolean) =>
      is_proband ? (
        <Tag color="red">{intl.get('proband')}</Tag>
      ) : (
        <Tag color="geekblue">{intl.get('parent')}</Tag>
      ),
    filters: [
      {
        text: intl.get('proband'),
        value: true,
      },
      {
        text: intl.get('parent'),
        value: false,
      },
    ],
    onFilter: (value, record: DonorsEntity) => value === record.is_proband,
  },
  {
    key: 'is_proband',
    dataIndex: 'affected_status',
    title: intl.get('screen.variantDetails.patientsTab.status'),
    render: (affected_status: boolean) =>
      intl.get(`screen.variantDetails.patientsTab.${affected_status ? 'affected' : 'notaffected'}`),
    filters: [
      {
        text: intl.get('screen.variantDetails.patientsTab.affected'),
        value: true,
      },
      {
        text: intl.get('screen.variantDetails.patientsTab.notaffected'),
        value: false,
      },
    ],
    onFilter: (value, record: DonorsEntity) => value === record.affected_status,
  },
  {
    key: 'family_id',
    dataIndex: 'family_id',
    title: intl.get('screen.variantDetails.patientsTab.familyId'),
    render: (family_id) => (family_id ? family_id : DISPLAY_WHEN_EMPTY_DATUM),
    sorter: (a, b) => a.family_id.localeCompare(b.family_id),
  },
  {
    key: 'filters',
    dataIndex: 'filters',
    title: intl.get('screen.variantDetails.patientsTab.filter'),
    render: (filters) => (filters ? filters[0] : DISPLAY_WHEN_EMPTY_DATUM),
  },
  {
    key: 'qd',
    dataIndex: 'qd',
    title: intl.get('screen.variantDetails.patientsTab.qd'),
    sorter: (a, b) => a.qd - b.qd,
    render: (qd) => (qd ? qd : DISPLAY_WHEN_EMPTY_DATUM),
  },
  {
    key: 'ad_alt',
    dataIndex: 'ad_alt',
    title: intl.get('screen.variantDetails.patientsTab.adAlt'),
    sorter: (a, b) => a.ad_alt - b.ad_alt,
    render: (ad_alt) => (ad_alt ? ad_alt : DISPLAY_WHEN_EMPTY_DATUM),
  },
  {
    key: 'ad_total',
    dataIndex: 'ad_total',
    title: intl.get('screen.variantDetails.patientsTab.adTotal'),
    sorter: (a, b) => a.ad_total - b.ad_total,
    render: (ad_total) => (ad_total ? ad_total : DISPLAY_WHEN_EMPTY_DATUM),
  },
  {
    key: 'ad_ratio',
    dataIndex: 'ad_ratio',
    title: intl.get('screen.variantDetails.patientsTab.adFreq'),
    render: (ratio: number) => ratio.toFixed(2),
    sorter: (a, b) => a.ad_ratio - b.ad_ratio,
  },
  {
    key: 'gq',
    dataIndex: 'gq',
    title: intl.get('screen.variantDetails.patientsTab.genotypeQuality'),
    sorter: (a, b) => a.gq - b.gq,
    render: (gq) => (gq ? gq : DISPLAY_WHEN_EMPTY_DATUM),
  },
];

const PatientPanel = ({ hash, className = '' }: OwnProps) => {
  const [currentTotal, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { loading, data, error } = useTabPatientData(hash);
  const donorsHits = (data?.donors as ArrangerResultsTree<DonorsEntity>)?.hits;

  useEffect(() => {
    if (!loading) {
      setTotal(donorsHits?.total!);
    }
  }, [donorsHits, loading]);

  if (error) {
    return <ServerError />;
  }

  const dataSource = makeRows(donorsHits?.edges);

  return (
    <div className={cx(styles.patientPanel, className)}>
      <Spin spinning={loading}>
        <Card>
          <ProTable<TTableDonorEntity>
            tableId="patient_panel_table"
            columns={getPatientPanelColumns(donorsHits)}
            dataSource={dataSource ?? []}
            loading={loading}
            dictionary={getProTableDictionary()}
            onChange={({ current, pageSize }) => {
              if (currentPage !== current || currentPageSize !== pageSize) {
                setCurrentPage(current!);
                setCurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
              }
            }}
            headerConfig={{
              itemCount: {
                pageIndex: currentPage,
                pageSize: currentPageSize,
                total: donorsHits?.total || 0,
              },
            }}
            size="small"
            bordered
            pagination={{
              current: currentPage,
              pageSize: currentPageSize,
              defaultPageSize: DEFAULT_PAGE_SIZE,
              total: donorsHits?.total ?? 0,
              hideOnSinglePage: true,
              className: styles.patientPagination,
            }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default PatientPanel;
