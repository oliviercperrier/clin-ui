import intl from 'react-intl-universal';
import { Tooltip } from 'antd';
import Status, { StatusOptions } from '@ferlab/ui/core/components/labels/Status';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { PatientIdCell, PrescriptionIdCell } from './cell/LinkCell';
import { formatDate } from 'utils/date';
import { ITablePrescriptionResult } from 'graphql/prescriptions/models/Prescription';

import './tableColumn.scss';

export const prescriptionsColumns = (): ProColumnType<ITablePrescriptionResult>[] => {
  const statusTranslation = {
    [StatusOptions.Active]: intl.get('filters.options.state.active'),
    [StatusOptions.Completed]: intl.get('filters.options.state.completed'),
    [StatusOptions.Draft]: intl.get('filters.options.state.draft'),
    [StatusOptions.Revoked]: intl.get('filters.options.revoked'),
    [StatusOptions.Submitted]: intl.get('filters.options.state.submitted'),
    [StatusOptions.Incomplete]: intl.get('filters.options.state.incomplete'),
  };

  return [
    {
      name: ['cid'],
      render: (cid: string, prescription: any) => {
        return <PrescriptionIdCell patientId={prescription.patientInfo?.cid || ''} text={cid} />;
      },
      title: intl.get('screen.patientsearch.table.prescription'),
    },
    {
      name: ['patientInfo', 'cid'],
      render: (cid: string) => <PatientIdCell id={cid} />,
      summary: false,
      title: intl.get('screen.patientsearch.table.patientId'),
    },
    {
      name: 'state',
      render: (value: string) =>
        !!value ? <Status dictionary={statusTranslation} status={value} /> : null,
      summary: false,
      title: intl.get('screen.patientsearch.table.status'),
    },
    {
      name: 'timestamp',
      render: (date: string) => formatDate(date),
      summary: false,
      title: (
        <Tooltip placement="topLeft" title={intl.get('standard.format.date')} arrowPointAtCenter>
          {intl.get('screen.patientsearch.table.date')}
        </Tooltip>
      ),
      displayTitle: intl.get('screen.patientsearch.table.date'),
    },
    {
      name: ['analysis', 'code'],
      summary: true,
      title: intl.get('screen.patientsearch.table.test'),
    },
    {
      name: ['patientInfo', 'organization', 'cid'],
      summary: true,
      title: intl.get('screen.patientsearch.table.establishment'),
    },
    {
      name: 'prescriber',
      render: (p: Record<string, string>) => `${p.lastName.toUpperCase()} ${p.firstName}`,
      summary: true,
      title: intl.get('screen.patientsearch.table.prescriber'),
    },
  ].map((c) => ({
    ...c,
    dataIndex: c.name,
    key: Array.isArray(c.name) ? c.name.join('.') : c.name,
  }));
};
