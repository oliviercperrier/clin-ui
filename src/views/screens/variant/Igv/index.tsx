import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { GraphqlBackend } from "store/providers";
import useQueryString from "utils/useQueryString";
import ApolloProvider from "store/providers/apollo";
import { usePatientFilesData } from "store/graphql/patients/actions";

declare global {
  interface Window {
    igv: any;
  }
}

type IReference = {
  id: string;
  fastaURL?: string;
  cytobandURL?: string;
};

type IIGVOptions = {
  genome?: string;
  reference?: IReference;
  palette?: string[];
  locus: string;
  tracks?: any[];
};

interface OwnProps {
  id?: string;
  className?: string;
  options: IIGVOptions;
}

const tokenTest =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3a2xNaVgtUmdTbHk0X0puRG9ULXotNWJEdmMwb2NYSEF5MWE1ZDg1ZnZJIn0.eyJleHAiOjE2Mzc5NDQ5NjEsImlhdCI6MTYzNzk0NDkwMSwiYXV0aF90aW1lIjoxNjM3OTQxMDgxLCJqdGkiOiI5OTIyYTE0Zi1iMmNhLTQxNmYtODFlMi04MDQ2Yzc3NDQxZmYiLCJpc3MiOiJodHRwczovL2F1dGgucWEuY2xpbi5mZXJsYWIuYmlvL2F1dGgvcmVhbG1zL2NsaW4iLCJhdWQiOiJjbGluLWFjbCIsInN1YiI6IjY2ZmEwMWNhLWNlZTktNDkwMC1hZjIwLWIyNmFkNzZkMDc4NSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNsaW4tY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjRkNjE3MDcxLTA2NmQtNDY3YS1hODk3LTg2OGFjMWI5NjhkZiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9sb2NhbGhvc3Q6MjAwMCIsImh0dHBzOi8vcWEuY2xpbi5mZXJsYWIuYmlvIiwiaHR0cDovL2xvY2FsaG9zdDoyMDAwIiwiaHR0cHM6Ly9hdXRoLnFhLmNsaW4uZmVybGFiLmJpbyJdLCJhdXRob3JpemF0aW9uIjp7InBlcm1pc3Npb25zIjpbeyJzY29wZXMiOlsicmVhZCJdLCJyc2lkIjoiNTNhNzQ3NTItZGI4ZC00Mzc4LWJkYzctZjg3OGUxMmI1ZWNkIiwicnNuYW1lIjoiQ29kZVN5c3RlbSJ9LHsicnNpZCI6IjgyMDE2MThmLWFjYmEtNDc4Ny1hOGNlLTQzNTUzZTI4MjVlNCIsInJzbmFtZSI6InBhdGllbnQtdmFyaWFudHMifSx7InNjb3BlcyI6WyJyZWFkIl0sInJzaWQiOiIyNmFlMWEzOS00NTU1LTRhNTYtYjk3NS02MjU3MTQ3ZjRkMjgiLCJyc25hbWUiOiJWYWx1ZVNldCJ9LHsic2NvcGVzIjpbInJlYWQiXSwicnNpZCI6ImIxYmI2MTFjLTFjYTYtNDkyNC05NzVlLTk1NWVmMzhlNGVmZCIsInJzbmFtZSI6IkJ1bmRsZSJ9LHsic2NvcGVzIjpbInJlYWQiXSwicnNpZCI6IjcyM2E2ZmE3LWJmMDctNDIwMC1iZmYwLWFmYWFhNDdiMjgyZCIsInJzbmFtZSI6IlNwZWNpbWVuIn0seyJzY29wZXMiOlsicmVhZCJdLCJyc2lkIjoiMzYwNmRhYTktYTQyOS00MTY3LWJkNDEtMTIwMGY4MDczMTk5IiwicnNuYW1lIjoiQXVkaXRFdmVudCJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiXSwicnNpZCI6IjExZWQzOWMzLThkNTctNDEyMC1iNzZmLTg3MjFjNDFkYzU3NCIsInJzbmFtZSI6IlByYWN0aXRpb25lclJvbGUifSx7InNjb3BlcyI6WyJyZWFkIl0sInJzaWQiOiJiODRhNWM4NC01OTkxLTQwMzAtOWJlOS0xZTI4YzUwMTZiNDYiLCJyc25hbWUiOiJEb2N1bWVudFJlZmVyZW5jZSJ9LHsic2NvcGVzIjpbInJlYWQiXSwicnNpZCI6ImE5N2M2NTQ5LTU3NGMtNDE4Yy04NjQzLTUyMjViZDQyNTgzOSIsInJzbmFtZSI6IlRhc2sifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIl0sInJzaWQiOiI2NzRmNzQ4OS04YjU4LTQxZjYtODQyZC04YjEyMGUwMGZkNmEiLCJyc25hbWUiOiJPcmdhbml6YXRpb25BZmZpbGlhdGlvbiJ9LHsicnNpZCI6IjkwODRkZDFlLTFjODEtNGU4OC04YzYwLTMwODA3NDUyMzllYSIsInJzbmFtZSI6InBhdGllbnQtZmlsZXMifSx7InJzaWQiOiJiMDk0ODQ2OS0wZDllLTQ3OGYtYTEzNS04YzBiYzI2NTE3NjEiLCJyc25hbWUiOiJwYXRpZW50LWxpc3QifSx7InNjb3BlcyI6WyJyZWFkIiwiY3JlYXRlIiwidXBkYXRlIl0sInJzaWQiOiI3NTZjZjU4Ny1iNTFmLTQ5NzctOWZmNy0wMmU1ODNiYWEyMTUiLCJyc25hbWUiOiJHcm91cCJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiLCJ1cGRhdGUiXSwicnNpZCI6IjY4ODNiZjlkLTdjYzAtNDI3YS04NTIwLWVlZmZiMDEzMGU0NyIsInJzbmFtZSI6IlNlcnZpY2VSZXF1ZXN0In0seyJzY29wZXMiOlsicmVhZCJdLCJyc2lkIjoiYTllOTU5MTItNDQ1MC00MTQ2LWJiYmUtMDhhN2I4Y2JkYjRhIiwicnNuYW1lIjoiU2VhcmNoUGFyYW1ldGVyIn0seyJyc2lkIjoiZWJjMDlkZWQtZGUyOS00NGZlLTk2ZTctOWNlYTc0MmFkMWE3IiwicnNuYW1lIjoicGF0aWVudC1mYW1pbHkifSx7InJzaWQiOiIzYWI4OTEwMy1mYzljLTRmMDctOGRkOS00ODMxZDkyOGY1OTkiLCJyc25hbWUiOiJkb3dubG9hZCJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiLCJ1cGRhdGUiXSwicnNpZCI6IjMxMjkyMTM2LWVhMDItNGM5MS04MDNkLTQxNjU0YzM0ZDg5MCIsInJzbmFtZSI6Ik9ic2VydmF0aW9uIn0seyJzY29wZXMiOlsicmVhZCIsImNyZWF0ZSIsInVwZGF0ZSJdLCJyc2lkIjoiMjcwOGMyNWUtMWEzNC00ZDg5LWFiOGQtZmQ1NjgwMDJhYTgzIiwicnNuYW1lIjoiQ2xpbmljYWxJbXByZXNzaW9uIn0seyJzY29wZXMiOlsicmVhZCIsImNyZWF0ZSJdLCJyc2lkIjoiNTZjYTdkNWUtNDUzYS00NDc5LTljMDctYTI2Mzg1NjRjNzFmIiwicnNuYW1lIjoiT3JnYW5pemF0aW9uIn0seyJzY29wZXMiOlsicmVhZCJdLCJyc2lkIjoiZjU5OTlhMTQtZDFkZi00MzI0LWJiMmQtNDg5OTZlMjY3MGUzIiwicnNuYW1lIjoiU3RydWN0dXJlRGVmaW5pdGlvbiJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiLCJ1cGRhdGUiXSwicnNpZCI6ImY0NzQ3ODNlLWQ2MTQtNGNiOS04OTUwLWZlN2FmZjFjMThkNSIsInJzbmFtZSI6IkZhbWlseU1lbWJlckhpc3RvcnkifSx7InJzaWQiOiIxNjEwNjVkMi1mMDNiLTRmMmUtYTc2MS02NjRmYjg3MjA3NGEiLCJyc25hbWUiOiJNZXRhZGF0YSJ9LHsicnNpZCI6IjUxOGUwNjY1LWMyMWUtNGE4OS04MWEzLWMzZDVlMjQwNDZmYSIsInJzbmFtZSI6InBhdGllbnQtcHJlc2NyaXB0aW9ucyJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiXSwicnNpZCI6ImNkY2IwNGFlLTRkYmEtNDFkYi05MGIzLTA5MTdmZjViNTg4NSIsInJzbmFtZSI6IlByYWN0aXRpb25lciJ9LHsic2NvcGVzIjpbInJlYWQiLCJjcmVhdGUiLCJ1cGRhdGUiXSwicnNpZCI6ImJjYjAyNWI2LTg3YzMtNGQwZi04NjRhLTVmYTc0Mjc1ODFmZiIsInJzbmFtZSI6IlBhdGllbnQifV19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Ik9saXZpZXIgQ2FzdHJvLVBlcnJpZXIiLCJmaGlyX3ByYWN0aXRpb25lcl9pZCI6IjI2NDA0NyIsInByZWZlcnJlZF91c2VybmFtZSI6Im9jYXN0cm8tcGVycmllciIsImxvY2FsZSI6ImZyIiwiZ2l2ZW5fbmFtZSI6Ik9saXZpZXIiLCJmaGlyX29yZ2FuaXphdGlvbl9pZCI6Ik9SMDAyMDIiLCJmYW1pbHlfbmFtZSI6IkNhc3Ryby1QZXJyaWVyIiwiZW1haWwiOiJvY2FzdHJvLXBlcnJpZXJAZmVybGFiLmJpbyJ9.WUmFn1FPfjxqsCn5M6XShHsjAs-ChHMGupqWSLs94t31aAlYnOevNSazJIUiFdaNVag2KHOZ48vCk7XxKo7xWp5fRSSefGrZJWrn0RLl9XcqFhO72HnZxWuS3BHx3F0h2_g6fNZbZqUBXiAnImwGxs261ADiO7v6W21AY1xJLzIjqJXQ9oPaFXvEWxhlLhTBqH31YZWHbdFz-OhRE6W6UMnD3vY5UHdnTlOvglIe7PgNKHE4YxeBtaMcFnGOLTvRzS05EJ7qH2v_YAGteQBqx-HOzUFkLGOOJbXBinDGe3bLqxCZ6LTHcH_mq79rs9wf534OG7M2GgU5Us8G0t800g";

const getPresignedUrl = async (file: string) => {
  const response = await axios.get(`${file}?format=json`, {
    headers: { Authorization: `Bearer ${tokenTest}` },
  });
  return response.data.url;
};

const IGV = ({ id = "igvContainer", className = "", options }: OwnProps) => {
  const igvContainerRef = useRef<HTMLDivElement>(null);
  const [igvLoaded, setIGVLoaded] = useState(false);
  const [filesData, setFilesData] = useState({
    data: {
      Patient: {
        id: "Patient/PA00128/_history/1",
        docs: [
          {
            id: "DocumentReference/125676/_history/1",
            type: "SNV",
            content: [
              {
                attachment: {
                  url: "https://ferload.qa.clin.ferlab.bio/green/a35c9a0b-8b7a-4f61-88db-13509102ff67",
                  hash: "YmQ0YjcxZDVlOTk1NzY1MTJiZTg3NDU3M2MxMzNjOWQ=",
                  title: "16907.hard-filtered.gvcf.gz",
                },
                format: "VCF",
              },
              {
                attachment: {
                  url: "https://ferload.qa.clin.ferlab.bio/green/a35c9a0b-8b7a-4f61-88db-13509102ff67.tbi",
                  title: "16907.hard-filtered.gvcf.gz.tbi",
                },
                format: "TBI",
              },
            ],
          },
          {
            id: "DocumentReference/125675/_history/1",
            type: "AR",
            content: [
              {
                attachment: {
                  url: "https://ferload.qa.clin.ferlab.bio/green/475f95e5-7cbf-44c3-b549-5d6fc68cb4e9",
                  hash: "ZmRhMDc2ZDNlNzg2MzY2Y2M2YTgyZjhkODJhYWNhNzg=",
                  title: "16907.cram",
                },
                format: "CRAM",
              },
              {
                attachment: {
                  url: "https://ferload.qa.clin.ferlab.bio/green/475f95e5-7cbf-44c3-b549-5d6fc68cb4e9.crai",
                  title: "16907.cram.crai",
                },
                format: "CRAI",
              },
            ],
          },
          {
            id: "DocumentReference/125677/_history/1",
            type: "QC",
            content: [
              {
                attachment: {
                  url: "https://ferload.qa.clin.ferlab.bio/green/f609e3d2-e9ba-4a84-a9d5-a0e73c58ac6e",
                  title: "16907.QC.tgz",
                },
                format: "TGZ",
              },
            ],
          },
        ],
      },
    },
  });

  //const { loading, data } = usePatientFilesData("PA00128");

  useEffect(() => {
    //console.log(
    //  getPresignedUrl(filesData.data.Patient.docs[1].content[0].attachment.url)
    //);
    //console.log(
    //  getPresignedUrl(filesData.data.Patient.docs[1].content[1].attachment.url)
    //);

    if (igvContainerRef.current && !igvLoaded) {
      const myOptions: any = {
        palette: ["#00A0B0", "#6A4A3C", "#CC333F", "#EB6841"],
        genome: "hg38",
        locus: "chr8:127,736,588-127,739,371",
        tracks: [
          {
            type: "variant",
            format: "vcf",
            url: "/assets/igv/vcf/a35c9a0b-8b7a-4f61-88db-13509102ff67",
            indexURL:
              "/assets/igv/vcf/a35c9a0b-8b7a-4f61-88db-13509102ff67.tbi",
            name: "HG00096",
          },
          //{
          //  type: "alignment",
          //  format: "cram",
          //  url: "/assets/igv/cram/f609e3d2-e9ba-4a84-a9d5-a0e73c58ac6e",
          //  indexURL: "/assets/igv/cram/475f95e5-7cbf-44c3-b549-5d6fc68cb4e9.crai",
          //  name: "HG00096",
          //  sort: {
          //    chr: "chr8",
          //    position: 128750986,
          //    option: "BASE",
          //    direction: "ASC",
          //  },
          //  height: 600,
          //},
          {
            name: "Genes",
            type: "annotation",
            format: "bed",
            //url: "https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/refGene.hg19.bed.gz",
            //indexURL:
            //  "https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/refGene.hg19.bed.gz.tbi",
            url: "https://s3.amazonaws.com/igv.broadinstitute.org/data/hg38/gencode.v24.annotation.sorted.gtf.gz",
            indexURL:
              "https://s3.amazonaws.com/igv.broadinstitute.org/data/hg38/gencode.v24.annotation.sorted.gtf.gz.tbi",
            order: Number.MAX_VALUE,
            visibilityWindow: 300000000,
            displayMode: "EXPANDED",
          },
        ],
      };

      window.igv.createBrowser(igvContainerRef.current, myOptions);
      setIGVLoaded(true);
    }
  }, [igvContainerRef.current]);

  return <div id={id} ref={igvContainerRef} className={className}></div>;
};

const IGVWrapper = (props: OwnProps) => {
  const { token } = useQueryString();

  return (
    <ApolloProvider backend={GraphqlBackend.FHIR} token={tokenTest as string}>
      <IGV {...props} />
    </ApolloProvider>
  );
};

export default IGVWrapper;
