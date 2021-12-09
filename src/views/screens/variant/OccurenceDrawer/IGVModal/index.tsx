import React from 'react';
import { Modal } from 'antd';
import cx from 'classnames';
import intl from 'react-intl-universal';
import Igv from 'components/Igv';
import { getTopBodyElement } from 'utils/helper';
import axios from 'axios';
import { usePatientFilesData } from 'store/graphql/patients/actions';
import { GraphqlBackend } from 'store/providers';
import useQueryString from 'utils/useQueryString';
import ApolloProvider from 'store/providers/apollo';
import { VariantEntity } from 'store/graphql/variants/models';
import { FhirDoc, PatientFileResults } from 'store/graphql/patients/models/Patient';
import { IIGVTrack } from 'components/Igv/type';

import style from './index.module.scss';

interface OwnProps {
  patientId: string;
  variantEntity: VariantEntity;
  isOpen?: boolean;
  toggleModal: (visible: boolean) => void;
}

interface ITrackFiles {
  indexFile: string | undefined;
  mainFile: string | undefined;
}

const FHIR_CRAM_CRAI_DOC_TYPE = 'AR';
const FHIR_CRAM_TYPE = 'CRAM';
const FHIR_CRAI_TYPE = 'CRAI';

const tokenTest =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3a2xNaVgtUmdTbHk0X0puRG9ULXotNWJEdmMwb2NYSEF5MWE1ZDg1ZnZJIn0.eyJleHAiOjE2MzkwODQyNDEsImlhdCI6MTYzOTA4MDY0MSwianRpIjoiYTM3NThlNDUtMTdjNS00YzEyLTllMWUtYzYwZjI5M2UzZWQzIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnFhLmNsaW4uZmVybGFiLmJpby9hdXRoL3JlYWxtcy9jbGluIiwiYXVkIjoiY2xpbi1hY2wiLCJzdWIiOiI2NmZhMDFjYS1jZWU5LTQ5MDAtYWYyMC1iMjZhZDc2ZDA3ODUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjbGluLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJlNmJhNGFlYy1hMzM5LTQxNmYtOWEzMC02NTE1NmQ3NzAzMTIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjIwMDAiLCJodHRwczovL3FhLmNsaW4uZmVybGFiLmJpbyIsImh0dHA6Ly9sb2NhbGhvc3Q6MjAwMCIsImh0dHBzOi8vYXV0aC5xYS5jbGluLmZlcmxhYi5iaW8iXSwiYXV0aG9yaXphdGlvbiI6eyJwZXJtaXNzaW9ucyI6W3sic2NvcGVzIjpbInJlYWQiXSwicnNpZCI6IjUzYTc0NzUyLWRiOGQtNDM3OC1iZGM3LWY4NzhlMTJiNWVjZCIsInJzbmFtZSI6IkNvZGVTeXN0ZW0ifSx7InJzaWQiOiI4MjAxNjE4Zi1hY2JhLTQ3ODctYThjZS00MzU1M2UyODI1ZTQiLCJyc25hbWUiOiJwYXRpZW50LXZhcmlhbnRzIn0seyJzY29wZXMiOlsicmVhZCJdLCJyc2lkIjoiMjZhZTFhMzktNDU1NS00YTU2LWI5NzUtNjI1NzE0N2Y0ZDI4IiwicnNuYW1lIjoiVmFsdWVTZXQifSx7InNjb3BlcyI6WyJyZWFkIl0sInJzaWQiOiJiMWJiNjExYy0xY2E2LTQ5MjQtOTc1ZS05NTVlZjM4ZTRlZmQiLCJyc25hbWUiOiJCdW5kbGUifSx7InNjb3BlcyI6WyJyZWFkIl0sInJzaWQiOiI3MjNhNmZhNy1iZjA3LTQyMDAtYmZmMC1hZmFhYTQ3YjI4MmQiLCJyc25hbWUiOiJTcGVjaW1lbiJ9LHsic2NvcGVzIjpbInJlYWQiXSwicnNpZCI6IjM2MDZkYWE5LWE0MjktNDE2Ny1iZDQxLTEyMDBmODA3MzE5OSIsInJzbmFtZSI6IkF1ZGl0RXZlbnQifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIl0sInJzaWQiOiIxMWVkMzljMy04ZDU3LTQxMjAtYjc2Zi04NzIxYzQxZGM1NzQiLCJyc25hbWUiOiJQcmFjdGl0aW9uZXJSb2xlIn0seyJzY29wZXMiOlsicmVhZCJdLCJyc2lkIjoiYjg0YTVjODQtNTk5MS00MDMwLTliZTktMWUyOGM1MDE2YjQ2IiwicnNuYW1lIjoiRG9jdW1lbnRSZWZlcmVuY2UifSx7InNjb3BlcyI6WyJyZWFkIl0sInJzaWQiOiJhOTdjNjU0OS01NzRjLTQxOGMtODY0My01MjI1YmQ0MjU4MzkiLCJyc25hbWUiOiJUYXNrIn0seyJzY29wZXMiOlsicmVhZCIsImNyZWF0ZSJdLCJyc2lkIjoiNjc0Zjc0ODktOGI1OC00MWY2LTg0MmQtOGIxMjBlMDBmZDZhIiwicnNuYW1lIjoiT3JnYW5pemF0aW9uQWZmaWxpYXRpb24ifSx7InJzaWQiOiI5MDg0ZGQxZS0xYzgxLTRlODgtOGM2MC0zMDgwNzQ1MjM5ZWEiLCJyc25hbWUiOiJwYXRpZW50LWZpbGVzIn0seyJyc2lkIjoiYjA5NDg0NjktMGQ5ZS00NzhmLWExMzUtOGMwYmMyNjUxNzYxIiwicnNuYW1lIjoicGF0aWVudC1saXN0In0seyJzY29wZXMiOlsicmVhZCIsImNyZWF0ZSIsInVwZGF0ZSJdLCJyc2lkIjoiNzU2Y2Y1ODctYjUxZi00OTc3LTlmZjctMDJlNTgzYmFhMjE1IiwicnNuYW1lIjoiR3JvdXAifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIiwidXBkYXRlIl0sInJzaWQiOiI2ODgzYmY5ZC03Y2MwLTQyN2EtODUyMC1lZWZmYjAxMzBlNDciLCJyc25hbWUiOiJTZXJ2aWNlUmVxdWVzdCJ9LHsic2NvcGVzIjpbInJlYWQiXSwicnNpZCI6ImE5ZTk1OTEyLTQ0NTAtNDE0Ni1iYmJlLTA4YTdiOGNiZGI0YSIsInJzbmFtZSI6IlNlYXJjaFBhcmFtZXRlciJ9LHsicnNpZCI6ImViYzA5ZGVkLWRlMjktNDRmZS05NmU3LTljZWE3NDJhZDFhNyIsInJzbmFtZSI6InBhdGllbnQtZmFtaWx5In0seyJyc2lkIjoiM2FiODkxMDMtZmM5Yy00ZjA3LThkZDktNDgzMWQ5MjhmNTk5IiwicnNuYW1lIjoiZG93bmxvYWQifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIiwidXBkYXRlIl0sInJzaWQiOiIzMTI5MjEzNi1lYTAyLTRjOTEtODAzZC00MTY1NGMzNGQ4OTAiLCJyc25hbWUiOiJPYnNlcnZhdGlvbiJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiLCJ1cGRhdGUiXSwicnNpZCI6IjI3MDhjMjVlLTFhMzQtNGQ4OS1hYjhkLWZkNTY4MDAyYWE4MyIsInJzbmFtZSI6IkNsaW5pY2FsSW1wcmVzc2lvbiJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiXSwicnNpZCI6IjU2Y2E3ZDVlLTQ1M2EtNDQ3OS05YzA3LWEyNjM4NTY0YzcxZiIsInJzbmFtZSI6Ik9yZ2FuaXphdGlvbiJ9LHsic2NvcGVzIjpbInJlYWQiXSwicnNpZCI6ImY1OTk5YTE0LWQxZGYtNDMyNC1iYjJkLTQ4OTk2ZTI2NzBlMyIsInJzbmFtZSI6IlN0cnVjdHVyZURlZmluaXRpb24ifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIiwidXBkYXRlIl0sInJzaWQiOiJmNDc0NzgzZS1kNjE0LTRjYjktODk1MC1mZTdhZmYxYzE4ZDUiLCJyc25hbWUiOiJGYW1pbHlNZW1iZXJIaXN0b3J5In0seyJyc2lkIjoiMTYxMDY1ZDItZjAzYi00ZjJlLWE3NjEtNjY0ZmI4NzIwNzRhIiwicnNuYW1lIjoiTWV0YWRhdGEifSx7InJzaWQiOiI1MThlMDY2NS1jMjFlLTRhODktODFhMy1jM2Q1ZTI0MDQ2ZmEiLCJyc25hbWUiOiJwYXRpZW50LXByZXNjcmlwdGlvbnMifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIl0sInJzaWQiOiJjZGNiMDRhZS00ZGJhLTQxZGItOTBiMy0wOTE3ZmY1YjU4ODUiLCJyc25hbWUiOiJQcmFjdGl0aW9uZXIifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIiwidXBkYXRlIl0sInJzaWQiOiJiY2IwMjViNi04N2MzLTRkMGYtODY0YS01ZmE3NDI3NTgxZmYiLCJyc25hbWUiOiJQYXRpZW50In1dfSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJPbGl2aWVyIENhc3Ryby1QZXJyaWVyIiwiZmhpcl9wcmFjdGl0aW9uZXJfaWQiOiIyNjQwNDciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJvY2FzdHJvLXBlcnJpZXIiLCJsb2NhbGUiOiJmciIsImdpdmVuX25hbWUiOiJPbGl2aWVyIiwiZmhpcl9vcmdhbml6YXRpb25faWQiOiJDSFVTSiIsImZhbWlseV9uYW1lIjoiQ2FzdHJvLVBlcnJpZXIiLCJlbWFpbCI6Im9jYXN0cm8tcGVycmllckBmZXJsYWIuYmlvIn0.ZKjH-6Nu21d0Jt8tvzRtBZLoIJqRzbf8J3QrCSf5C5hWXhbA5b-b_HU8UxFuJjs_ieOEvPQdXWQy_-AmgyEZH9kWuqJsVdCq3ErmCMXwGIU77RUvq8fDQAv4tfIXoPIFpH-aJjHLVqaj4WaUx7hxwVfGkrAId43oF8jq_Y3VJwQDxSB1JYWYmgkzw2Ky-eljkGDJwDI6OuPoBA_J9uHnp8b4Ur-i6w03p0yW3nmornK-dKM1i9JSqxsQnq35R1jat69gU6PrMgY-00w_KJfRp4C1aKfj1i7Ns35Sc_2zA3zyLWo-Q5IRhzKogcJXZ9P96TM6_oe9-9VUZagnkKEBoA';

const getPresignedUrl = async (file: string) => {
  const response = await axios.get(`${file}?format=json`, {
    headers: { Authorization: `Bearer ${tokenTest}` },
  });
  return response.data.url;
};

const findCramAndCraiFiles = (doc: FhirDoc): ITrackFiles => {
  return {
    indexFile: doc?.content!.find((content) => content.format === FHIR_CRAI_TYPE)?.attachment.url,
    mainFile: doc?.content!.find((content) => content.format === FHIR_CRAM_TYPE)?.attachment.url,
  };
};

const generateCramTrack = (urls: ITrackFiles): IIGVTrack => ({
  type: 'alignment',
  format: 'cram',
  url: '/assets/igv/cram/a1ef87a3-9b43-44fc-bc4d-7bbcb74b4026',
  indexURL: '/assets/igv/cram/a1ef87a3-9b43-44fc-bc4d-7bbcb74b4026.crai',
  name: 'HG00096',
  height: 600,
  sort: {
    chr: "chr8",
    position: 128750986,
    option: "BASE",
    direction: "ASC",
  },
});

const buildTrack = (patientFiles: PatientFileResults) => {
  if (!patientFiles.docs) {
    return [];
  }

  let tracks: IIGVTrack[] = [];
  const cramDoc = patientFiles.docs.find((doc) => doc.type === FHIR_CRAM_CRAI_DOC_TYPE);
  const cramCraiFiles = findCramAndCraiFiles(cramDoc!);

  tracks.push(generateCramTrack(cramCraiFiles));

  return tracks;
};

const IGVModal = ({ patientId, variantEntity, isOpen = false, toggleModal }: OwnProps) => {
  const { loading, results } = usePatientFilesData('PA00128' /* patientId */);

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
      <Igv
        className={cx(style.igvContainer, 'igvContainer')}
        options={{
          palette: ['#00A0B0', '#6A4A3C', '#CC333F', '#EB6841'],
          genome: 'hg38',
          locus: 'chr8:127,736,588-127,739,371', //variantEntity?.locus,
          tracks: buildTrack(results!),
        }}
        loading={loading}
      />
    </Modal>
  );
};

const IGVModalWrapper = (props: OwnProps) => {
  const { token } = useQueryString();

  return (
    <ApolloProvider backend={GraphqlBackend.FHIR} token={tokenTest as string}>
      <IGVModal {...props} />
    </ApolloProvider>
  );
};

export default IGVModalWrapper;
