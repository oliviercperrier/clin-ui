import React from "react";
import { Card, Col, Divider, Row, Skeleton, Typography } from "antd";
import {
  ESResultNode,
  GeneEntity,
  VariantEntity,
} from "store/graphql/variants/models";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/Empty";
import intl from "react-intl-universal";

import styles from "./index.module.scss";

interface OwnProps {
  loading: boolean;
  variant: VariantEntity | null;
  genes: ESResultNode<GeneEntity>[];
}

const { Text } = Typography;

const SummaryCard = ({ loading, variant, genes }: OwnProps) => (
  <Card bordered={false} className={styles.summaryCard}>
    <Skeleton loading={loading} active>
      <Row>
        <Col>
          <Card className={styles.infoCard}>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>Chr</Text>
              <Text className={styles.infoValue}>{variant?.chromosome}</Text>
            </Row>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>Start</Text>
              <Text className={styles.infoValue}>{variant?.start}</Text>
            </Row>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>Allele Alt.</Text>
              <Text className={styles.infoValue}>{variant?.alternate}</Text>
            </Row>
            <Row className={styles.row}>
              <Text className={styles.infoTitle}>Allele Réf.</Text>
              <Text className={styles.infoValue}>{variant?.reference}</Text>
            </Row>
          </Card>
        </Col>
        <Col className={styles.resumeContent}>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>Type</Text>
            <Text className={styles.contentValue}>
              {variant?.variant_class}
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
              {variant?.assembly_version}
            </Text>
          </Row>
        </Col>
        <Divider className={styles.divider} type="vertical" />
        <Col className={styles.resumeContent}>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>ClinVar</Text>
            <Text className={styles.contentValue}>
              {variant?.clinVar?.clin_sig && variant?.clinVar.clinvar_id ? (
                <a
                  href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${variant?.clinVar.clinvar_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {variant?.clinVar.clin_sig.join(", ")}
                </a>
              ) : (
                DISPLAY_WHEN_EMPTY_DATUM
              )}
            </Text>
          </Row>
          <Row className={styles.row}>
            <Text className={styles.contentTitle}>dbSNP</Text>
            <Text className={styles.contentValue}>
              {variant?.rsnumber ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.ncbi.nlm.nih.gov/snp/${variant?.rsnumbermber}`}
                >
                  {variant?.rsnumber}
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
            <Text className={styles.contentValue}>
              {variant?.participant_number}
            </Text>
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
              {variant?.last_annotation_update
                ? new Date(variant?.last_annotation_update)
                    .toISOString()
                    .split("T")[0]
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Text>
          </Row>
        </Col>
      </Row>
    </Skeleton>
  </Card>
);

export default SummaryCard;
