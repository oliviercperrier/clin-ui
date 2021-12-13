import React from 'react';
import { Modal } from 'antd';
import cx from 'classnames';
import intl from 'react-intl-universal';
import Igv from 'components/Igv';
import { formatLocus, getTopBodyElement } from 'utils/helper';
import axios from 'axios';
import { usePatientFilesData } from 'store/graphql/patients/actions';
import { GraphqlBackend } from 'store/providers';
import useQueryString from 'utils/useQueryString';
import ApolloProvider from 'store/providers/apollo';
import { VariantEntity } from 'store/graphql/variants/models';
import { FhirDoc, PatientFileResults } from 'store/graphql/patients/models/Patient';
import { IIGVTrack } from 'components/Igv/type';
import ServerError from 'components/Results/ServerError';

import style from './index.module.scss';

interface OwnProps {
  patientId: string;
  variantEntity: VariantEntity;
  isOpen?: boolean;
  toggleModal: (visible: boolean) => void;
  token: string;
}

interface ITrackFiles {
  indexFile: string | undefined;
  mainFile: string | undefined;
}

const FHIR_CRAM_CRAI_DOC_TYPE = 'AR';
const FHIR_CRAM_TYPE = 'CRAM';
const FHIR_CRAI_TYPE = 'CRAI';

const getPresignedUrl = (file: string, token: string) => {
  return axios
    .get(`${file}?format=json`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      return response.data.url;
    });
};

const findCramAndCraiFiles = (doc: FhirDoc): ITrackFiles => ({
  indexFile: doc?.content!.find((content) => content.format === FHIR_CRAI_TYPE)?.attachment.url,
  mainFile: doc?.content!.find((content) => content.format === FHIR_CRAM_TYPE)?.attachment.url,
});

const generateCramTrack = (urls: ITrackFiles, trackName: string, token: string): IIGVTrack => ({
  type: 'alignment',
  format: 'cram',
  url: getPresignedUrl(urls.mainFile!, token),
  indexURL: getPresignedUrl(urls.indexFile!, token),
  name: trackName,
  height: 600,
  sort: {
    chr: 'chr8',
    option: 'BASE',
    position: 128750986,
    direction: 'ASC',
  },
});

const buildTrack = (patientFiles: PatientFileResults, token: string, patientId: string) => {
  if (!patientFiles.docs) {
    return [];
  }

  let tracks: IIGVTrack[] = [];
  const cramDoc = patientFiles.docs.find((doc) => doc.type === FHIR_CRAM_CRAI_DOC_TYPE);
  const cramCraiFiles = findCramAndCraiFiles(cramDoc!);

  tracks.push(generateCramTrack(cramCraiFiles, cramDoc?.sample.value!, token));

  return tracks;
};

const IGVModal = ({ patientId, variantEntity, isOpen = false, toggleModal, token }: OwnProps) => {
  const { loading, results, error } = usePatientFilesData(patientId);

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
      {error ? (
        <ServerError />
      ) : (
        <Igv
          className={cx(style.igvContainer, 'igvContainer')}
          options={{
            palette: ['#00A0B0', '#6A4A3C', '#CC333F', '#EB6841'],
            genome: 'hg38',
            locus: formatLocus(variantEntity?.locus, 500),
            tracks: buildTrack(results!, token, patientId),
          }}
          loading={loading}
        />
      )}
    </Modal>
  );
};

const IGVModalWrapper = (props: Omit<OwnProps, 'token'>) => {
  const { token } = useQueryString();

  return (
    <ApolloProvider backend={GraphqlBackend.FHIR} token={token as string}>
      <IGVModal {...props} token={token as string} />
    </ApolloProvider>
  );
};

export default IGVModalWrapper;
