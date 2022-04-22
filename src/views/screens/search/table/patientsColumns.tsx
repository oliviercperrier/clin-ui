import intl from 'react-intl-universal';
import { Tooltip } from 'antd';
import { PatientIdCell } from './cell/LinkCell';
import { formatDate } from 'utils/date';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { ITablePatientResult } from 'graphql/patients/models/Patient';

import './tableColumn.scss';

export const patientsColumns = (): ProColumnType<ITablePatientResult>[] =>
  [
    {
      name: 'cid',
      summary: false,
      title: intl.get('screen.patientsearch.table.patient'),
      render: (cid: string) => <PatientIdCell id={cid} />,
    },
    {
      name: 'ramq',
      summary: false,
      title: intl.get('screen.patientsearch.table.ramq'),
    },
    {
      name: 'lastName',
      summary: false,
      title: intl.get('screen.patient.details.edit.lastname'),
      render: (lastName: string) => lastName.toUpperCase(),
    },
    {
      name: 'firstName',
      summary: true,
      title: intl.get('screen.patient.details.edit.firstname'),
    },
    {
      name: 'gender',
      summary: true,
      title: intl.get('screen.patientsearch.table.gender'),
      render: (gender: string) =>
        intl.get(`screen.patientsearch.table.gender.${gender.toLowerCase()}`),
    },
    {
      name: 'birthDate',
      summary: false,
      title: (
        <Tooltip placement="topLeft" title={intl.get('standard.format.date')} arrowPointAtCenter>
          {intl.get('screen.patientsearch.table.dob')}
        </Tooltip>
      ),
      displayTitle: intl.get('screen.patientsearch.table.dob'),
    },
    {
      name: 'timestamp',
      summary: false,
      title: (
        <Tooltip placement="topLeft" title={intl.get('standard.format.date')} arrowPointAtCenter>
          {intl.get('screen.patientsearch.table.dateCreation')}
        </Tooltip>
      ),
      displayTitle: intl.get('screen.patientsearch.table.dateCreation'),
      render: (date: string) => formatDate(date),
    },
  ].map((c) => ({
    ...c,
    dataIndex: c.name,
    key: Array.isArray(c.name) ? c.name.join('.') : c.name,
  }));
