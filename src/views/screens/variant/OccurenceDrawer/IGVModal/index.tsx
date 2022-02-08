import React from 'react';
import { Modal } from 'antd';
import cx from 'classnames';
import intl from 'react-intl-universal';
import Igv from 'components/Igv';
import { formatLocus, getPatientPosition, getTopBodyElement } from 'utils/helper';
import axios from 'axios';
import { usePatientFilesData } from 'store/graphql/patients/actions';
import { GraphqlBackend } from 'store/providers';
import ApolloProvider from 'store/providers/apollo';
import { DonorsEntity, VariantEntity } from 'store/graphql/variants/models';
import { FhirDoc, PatientFileResults } from 'store/graphql/patients/models/Patient';
import { IIGVTrack } from 'components/Igv/type';
import ServerError from 'components/Results/ServerError';

import style from 'views/screens/variant/OccurenceDrawer/IGVModal/index.module.scss';
import { GENDER, PARENT_TYPE, PATIENT_POSITION } from 'utils/constants';

interface OwnProps {
  donor: DonorsEntity;
  variantEntity: VariantEntity;
  isOpen?: boolean;
  toggleModal: (visible: boolean) => void;
  rpt: string;
}

interface ITrackFiles {
  indexFile: string | undefined;
  mainFile: string | undefined;
}

const FHIR_CRAM_CRAI_DOC_TYPE = 'AR';
const FHIR_CRAM_TYPE = 'CRAM';
const FHIR_CRAI_TYPE = 'CRAI';

const getPresignedUrl = (file: string, rpt: string) => {
  return axios
    .get(`${file}?format=json`, {
      headers: { Authorization: `Bearer ${rpt}` },
    })
    .then((response) => {
      return response.data.url;
    });
};

const findCramAndCraiFiles = (doc: FhirDoc): ITrackFiles => ({
  indexFile: doc?.content!.find((content) => content.format === FHIR_CRAI_TYPE)?.attachment.url,
  mainFile: doc?.content!.find((content) => content.format === FHIR_CRAM_TYPE)?.attachment.url,
});

const generateCramTrack = (
  files: PatientFileResults,
  patientId: string,
  gender: GENDER,
  position: PATIENT_POSITION | PARENT_TYPE,
  rpt: string,
): IIGVTrack => {
  const cramDoc = files.docs.find((doc) => doc.type === FHIR_CRAM_CRAI_DOC_TYPE);
  const cramCraiFiles = findCramAndCraiFiles(cramDoc!);
  const cramTrackName = `${cramDoc?.sample.value!} (${patientId} : ${getPatientPosition(
    gender,
    position,
  )})`;

  return {
    type: 'alignment',
    format: 'cram',
    url: getPresignedUrl(cramCraiFiles.mainFile!, rpt),
    indexURL: getPresignedUrl(cramCraiFiles.indexFile!, rpt),
    name: cramTrackName,
    height: 500,
    colorBy: 'strand',
    sort: {
      chr: 'chr8',
      option: 'BASE',
      position: 128750986,
      direction: 'ASC',
    },
  };
};

const buildTracks = (
  patientFiles: PatientFileResults,
  motherFiles: PatientFileResults,
  fatherFiles: PatientFileResults,
  rpt: string,
  donor: DonorsEntity,
) => {
  if (!patientFiles.docs) {
    return [];
  }

  let tracks: IIGVTrack[] = [];

  tracks.push(
    generateCramTrack(
      patientFiles,
      donor.patient_id,
      donor.gender as GENDER,
      donor.is_proband ? PATIENT_POSITION.PROBAND : PATIENT_POSITION.PARENT,
      rpt,
    ),
  );

  if (donor.mother_id && motherFiles) {
    tracks.push(
      generateCramTrack(motherFiles, donor.mother_id, GENDER.FEMALE, PARENT_TYPE.MOTHER, rpt),
    );
  }

  if (donor.father_id && fatherFiles) {
    tracks.push(
      generateCramTrack(fatherFiles, donor.father_id, GENDER.MALE, PARENT_TYPE.FATHER, rpt),
    );
  }

  return tracks;
};

const IGVModal = ({ donor, variantEntity, isOpen = false, toggleModal, rpt }: OwnProps) => {
  const { loading, results, error } = usePatientFilesData(donor?.patient_id, !isOpen);
  const {
    loading: motherLoading,
    results: motherResults,
    error: motherError,
  } = usePatientFilesData(donor?.mother_id!, !isOpen || !donor?.mother_id);
  const {
    loading: fatherLoading,
    results: fatherResults,
    error: fatherError,
  } = usePatientFilesData(donor?.father_id!, !isOpen || !donor?.father_id);

  return (
    <Modal
      width="90vw"
      visible={isOpen}
      footer={false}
      title={intl.get('screen.patientvariant.drawer.igv.title')}
      onCancel={() => toggleModal(false)}
      getContainer={() => getTopBodyElement()}
      className={cx(style.igvModal, 'igvModal')}
      wrapClassName={cx(style.igvModalWrapper, 'igvModalWrapper')}
    >
      {error || motherError || fatherError ? (
        <ServerError />
      ) : (
        isOpen &&
        !(loading || motherLoading || fatherLoading) && (
          <Igv
            className={cx(style.igvContainer, 'igvContainer')}
            options={{
              palette: ['#00A0B0', '#6A4A3C', '#CC333F', '#EB6841'],
              genome: 'hg38',
              locus: formatLocus(variantEntity?.start, variantEntity?.chromosome, 20),
              tracks: buildTracks(results!, motherResults, fatherResults, rpt, donor!),
            }}
          />
        )
      )}
    </Modal>
  );
};

const IGVModalWrapper = (props: OwnProps) => (
  <ApolloProvider backend={GraphqlBackend.FHIR}>
    <IGVModal {...props} />
  </ApolloProvider>
);

export default IGVModalWrapper;
