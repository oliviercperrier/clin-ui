import React from "react";
import cx from "classnames";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { Card, Col, Divider, Row, Typography, Skeleton, Table } from "antd";
import intl from "react-intl-universal";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/Empty";
import {
  ESResult,
  GeneEntity,
  VariantEntity,
} from "store/graphql/variants/models";

import styles from "./index.module.scss";

interface OwnProps {
  data: {
    loading: boolean;
    variantData: VariantEntity;
  };
}

const { Text } = Typography;

const ResumePanel = ({ data }: OwnProps) => {
  const variantData = data.variantData;
  const genes = (variantData?.genes as ESResult<GeneEntity>)?.hits.edges;

  return (
    <StackLayout className={cx(styles.resumePanel, "page-container")} vertical>
      <Card bordered={false} className={styles.resumeCard}>
        <Skeleton loading={data.loading} active>
          <Row>
            <Col>
              <Card className={styles.infoCard}>
                <Row className={styles.row}>
                  <Text className={styles.infoTitle}>Chr</Text>
                  <Text className={styles.infoValue}>
                    {variantData?.chromosome}
                  </Text>
                </Row>
                <Row className={styles.row}>
                  <Text className={styles.infoTitle}>Start</Text>
                  <Text className={styles.infoValue}>{variantData?.start}</Text>
                </Row>
                <Row className={styles.row}>
                  <Text className={styles.infoTitle}>Allele Alt.</Text>
                  <Text className={styles.infoValue}>
                    {variantData?.alternate}
                  </Text>
                </Row>
                <Row className={styles.row}>
                  <Text className={styles.infoTitle}>Allele Réf.</Text>
                  <Text className={styles.infoValue}>
                    {variantData?.reference}
                  </Text>
                </Row>
              </Card>
            </Col>
            <Col className={styles.resumeContent}>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>Type</Text>
                <Text className={styles.contentValue}>
                  {variantData?.variant_class}
                </Text>
              </Row>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>Cytobande</Text>
                <Text className={styles.contentValue}>
                  {genes && genes[0]
                    ? genes[0].node.location || DISPLAY_WHEN_EMPTY_DATUM
                    : DISPLAY_WHEN_EMPTY_DATUM}
                </Text>
              </Row>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>Genome Réf</Text>
                <Text className={styles.contentValue}>
                  {variantData?.assembly_version}
                </Text>
              </Row>
            </Col>
            <Divider className={styles.divider} type="vertical" />
            <Col className={styles.resumeContent}>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>ClinVar</Text>
                <Text className={styles.contentValue}>
                  {variantData?.clinVar?.clin_sig &&
                  variantData?.clinVar.clinvar_id ? (
                    <a
                      href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${variantData?.clinVar.clinvar_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {variantData?.clinVar.clin_sig.join(", ")}
                    </a>
                  ) : (
                    DISPLAY_WHEN_EMPTY_DATUM
                  )}
                </Text>
              </Row>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>dbSNP</Text>
                <Text className={styles.contentValue}>
                  {variantData?.rsnumber ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.ncbi.nlm.nih.gov/snp/${variantData?.rsnumbermber}`}
                    >
                      {variantData?.rsnumber}
                    </a>
                  ) : (
                    DISPLAY_WHEN_EMPTY_DATUM
                  )}
                </Text>
              </Row>
            </Col>
            <Divider className={styles.divider} type="vertical" />
            <Col className={styles.resumeContent}>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>Patients</Text>
                <Text className={styles.contentValue}>SNV</Text>
              </Row>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>
                  {intl.get(
                    "screen.variantDetails.summaryTab.patientTable.frequencies"
                  )}
                </Text>
                <Text className={styles.contentValue}>
                  {DISPLAY_WHEN_EMPTY_DATUM}
                </Text>
              </Row>
              <Row className={styles.row}>
                <Text className={styles.contentTitle}>Annotations</Text>
                <Text className={styles.contentValue}>
                  {variantData?.last_annotation_update
                    ? new Date(variantData?.last_annotation_update)
                        .toISOString()
                        .split("T")[0]
                    : DISPLAY_WHEN_EMPTY_DATUM}
                </Text>
              </Row>
            </Col>
          </Row>
        </Skeleton>
      </Card>
      <Card
        bordered={false}
        title={intl.get(
          "screen.variantDetails.summaryTab.consequencesTable.title"
        )}
      >
        {["Allo", "Allo2"].map((element) => (
          <Card bordered={false} title={element}>
            <Table></Table>
          </Card>
        ))}
      </Card>
    </StackLayout>
  );
};

export default ResumePanel;
