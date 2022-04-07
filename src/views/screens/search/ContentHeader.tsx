import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import { AutoComplete, Button, Col, Input, Row, Typography } from 'antd';
import useFeatureToggle from 'hooks/useFeatureToggle';
import { useDispatch } from 'react-redux';
import { prescriptionFormActions } from 'store/prescription/slice';
// import PatientCreation from 'components/screens/PatientCreation';
import { GqlResults } from 'graphql/models';
import { PatientResult } from 'graphql/patients/models/Patient';
import { createPrescription } from 'utils/bridge';
import { redirectParent } from 'utils/bridge';

import './ContentHeader.scss';
import { AnalysisType } from 'store/prescription/types';

export type PrescriptionResultsContainerProps = {
  searchResults: GqlResults<PatientResult> | null;
};

const autoCompleteResults = (data: PatientResult[]) => {
  return data.map((result) => ({
    label: (
      <>
        <Row className="autocomplete-row">
          <Col>
            <Typography.Text className="autocomplete-row__name">
              {result.lastName.toUpperCase()} {result.firstName}{' '}
              {result.fetus && <i>({intl.get('screen.patient.details.fetus')})</i>}
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Text className="autocomplete-row__mrn">
              {intl.get('screen.patientsearch.table.ramq')}: {result.ramq}
            </Typography.Text>
          </Col>
        </Row>
      </>
    ),
    value: result.id,
  }));
};

const ContentHeader = ({
  searchResults,
}: PrescriptionResultsContainerProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { isEnabled } = useFeatureToggle('prescriptionV4');
  const [filteredResults, setFilteredResults] = useState<PatientResult[]>([]);

  return (
    <StackLayout horizontal>
      <AutoComplete
        allowClear
        autoFocus
        className="auto-complete"
        defaultActiveFirstOption={false}
        onChange={(value) => {
          if (!value) {
            setFilteredResults([]);
            return;
          }
          const searchValues = value.split(' ').map((value: string) => value.toLowerCase());
          const results = searchResults?.data!.filter((patient) => {
            const infoToSearch = [
              patient.cid,
              patient.ramq,
              patient.firstName,
              patient.lastName,
              patient.familyId,
              patient.birthDate,
              patient.mrn,
            ]
              .join(',')
              .toLowerCase();

            return searchValues.some((searchValue: string) => infoToSearch.includes(searchValue));
          });
          setFilteredResults(results!);
        }}
        onSelect={(id: string) => {
          redirectParent(`/patient/${id}`);
        }}
        options={autoCompleteResults(filteredResults)}
        size="large"
      >
        <Input
          placeholder={intl.get('screen.patientsearch.placeholder')}
          prefix={<SearchOutlined />}
          size="large"
        />
      </AutoComplete>
      <Button
        className="buttonCreatePrescription"
        onClick={(e) => {
          if (isEnabled) {
            dispatch(prescriptionFormActions.startAnalyseChoice());
          } else {
            createPrescription();
          }
        }}
        type="primary"
        size="large"
      >
        <PlusOutlined />
        {intl.get(`screen.patient.creation.createPrescription`)}
      </Button>
    </StackLayout>
  );
};
export default ContentHeader;
