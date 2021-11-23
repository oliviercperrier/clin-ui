import React, { useEffect, useState } from "react";
import cx from "classnames";
import intl from "react-intl-universal";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { useTabPatientData } from "store/graphql/variants/tabActions";
import ServerError from "components/Results/ServerError";
import { Card, Table, Spin, Tag, InputNumber, Button } from "antd";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/constants";
import { ColumnType } from "antd/lib/table";
import {
  DonorsEntity,
  ESResult,
  ESResultNode,
} from "store/graphql/variants/models";
import { formatTimestampToISODate } from "utils/helper";

import styles from "./index.module.scss";

interface OwnProps {
  hash: string;
}

const DEFAULT_PAGE_SIZE = 20;

const makeRows = (donors: ESResultNode<DonorsEntity>[]): DonorsEntity[] => {
  return donors?.map((donor: ESResultNode<DonorsEntity>, index) => ({
    key: index,
    patient_id: donor.node.patient_id,
    organization_id: donor.node.organization_id,
    gender: donor.node.gender.toLowerCase(),
    is_proband: donor.node.is_proband,
    family_id: donor.node.family_id,
    last_update: formatTimestampToISODate(donor.node.last_update as number),
    qd: donor.node.qd,
    gq: donor.node.gq,
    ad_alt: donor.node.ad_alt,
    ad_total: donor.node.ad_total,
    ad_ratio: donor.node.ad_ratio,
    affected_status: donor.node.affected_status,
  }));
};

const getBorderValueAtIndex = (
  donors: ESResultNode<DonorsEntity>[],
  dataIndex: string,
  func: any
) => {
  return func.apply(
    Math,
    (donors || []).map((donor) => (donor.node as any)[dataIndex])
  );
};

const getMaxValue = (
  donors: ESResultNode<DonorsEntity>[],
  dataIndex: string
) => {
  return getBorderValueAtIndex(donors, dataIndex, Math.max);
};

const getMinValue = (
  donors: ESResultNode<DonorsEntity>[],
  dataIndex: string
) => {
  return getBorderValueAtIndex(donors, dataIndex, Math.min);
};

const PatientPanel = ({ hash }: OwnProps) => {
  const [currentTotal, setTotal] = useState(0);
  const { loading, data, error } = useTabPatientData(hash);
  const donorsHits = (data?.donors as ESResult<DonorsEntity>)?.hits;

  useEffect(() => {
    setTotal(donorsHits?.total!);
  }, [donorsHits]);

  if (error) {
    return <ServerError />;
  }

  const columns: ColumnType<DonorsEntity>[] = [
    {
      dataIndex: "patient_id",
      title: () => intl.get("screen.variantDetails.patientsTab.donor"),
    },
    {
      dataIndex: "gender",
      title: () => intl.get("screen.variantDetails.patientsTab.sex"),
      render: (gender: string) =>
        intl.get("screen.variantDetails.patientsTab." + gender),
      filters: [
        {
          text: intl.get("screen.variantDetails.patientsTab.male"),
          value: "male",
        },
        {
          text: intl.get("screen.variantDetails.patientsTab.female"),
          value: "female",
        },
      ],
      onFilter: (value: any, record: DonorsEntity) => value === record.gender,
    },
    {
      dataIndex: "is_proband",
      title: () => intl.get("screen.variantDetails.patientsTab.relation"),
      render: (is_proband: boolean) =>
        is_proband ? (
          <Tag color="error">Proband</Tag>
        ) : (
          <Tag color="geekblue">Parent</Tag>
        ),
      filters: [
        {
          text: "Proband",
          value: true,
        },
        {
          text: "Parent",
          value: false,
        },
      ],
      onFilter: (value: any, record: DonorsEntity) =>
        value === record.is_proband,
    },
    {
      dataIndex: "affected_status",
      title: () => intl.get("screen.variantDetails.patientsTab.status"),
      render: (affected_status: boolean) =>
        intl.get(
          "screen.variantDetails.patientsTab." +
            (affected_status ? "affected" : "notaffected")
        ),
      filters: [
        {
          text: intl.get("screen.variantDetails.patientsTab.affected"),
          value: true,
        },
        {
          text: intl.get("screen.variantDetails.patientsTab.notaffected"),
          value: false,
        },
      ],
      onFilter: (value: any, record: DonorsEntity) =>
        value === record.affected_status,
    },
    {
      dataIndex: "family_id",
      title: () => intl.get("screen.variantDetails.patientsTab.familyId"),
      render: (family_id) => (family_id ? family_id : DISPLAY_WHEN_EMPTY_DATUM),
    },
    {
      dataIndex: "qd",
      title: () => intl.get("screen.variantDetails.patientsTab.qd"),
      sorter: (a, b) => a.qd - b.qd,
      render: (qd) => (qd ? qd : DISPLAY_WHEN_EMPTY_DATUM),
    },
    {
      dataIndex: "ad_alt",
      title: () => intl.get("screen.variantDetails.patientsTab.adAlt"),
      sorter: (a, b) => a.ad_alt - b.ad_alt,
      render: (ad_alt) => (ad_alt ? ad_alt : DISPLAY_WHEN_EMPTY_DATUM),
    },
    {
      dataIndex: "ad_total",
      title: () => intl.get("screen.variantDetails.patientsTab.adTotal"),
      sorter: (a, b) => a.ad_total - b.ad_total,
      render: (ad_total) => (ad_total ? ad_total : DISPLAY_WHEN_EMPTY_DATUM),
    },
    {
      dataIndex: "ad_ratio",
      title: () => intl.get("screen.variantDetails.patientsTab.adFreq"),
      render: (ratio: number) => `${(ratio * 100).toFixed(1)}%`,
      sorter: (a, b) => a.ad_ratio - b.ad_ratio,
    },
    {
      dataIndex: "gq",
      title: () =>
        intl.get("screen.variantDetails.patientsTab.genotypeQuality"),
      sorter: (a, b) => a.gq - b.gq,
      render: (gq) => (gq ? gq : DISPLAY_WHEN_EMPTY_DATUM),
    },
  ];

  return (
    <StackLayout className={cx(styles.patientPanel, "page-container")} vertical>
      <Spin spinning={loading}>
        <Card>
          <div className={styles.tableTotalTitle}>
            Résultats <strong>1 - {DEFAULT_PAGE_SIZE}</strong> sur{" "}
            <strong>{currentTotal}</strong>
          </div>
          <Table
            dataSource={makeRows(donorsHits?.edges)}
            columns={columns}
            size="small"
            pagination={{
              defaultPageSize: DEFAULT_PAGE_SIZE,
              className: styles.patientPagination,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              setTotal(extra.currentDataSource.length);
            }}
          />
        </Card>
      </Spin>
    </StackLayout>
  );
};

export default PatientPanel;
