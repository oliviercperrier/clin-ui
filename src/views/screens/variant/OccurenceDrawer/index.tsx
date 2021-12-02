import React, { useState } from "react";
import {
  Button,
  Descriptions,
  Divider,
  Space,
  Drawer,
  Tooltip,
} from "antd";
import intl from "react-intl-universal";
import { CloseOutlined } from "@ant-design/icons";
import ExternalLinkIcon from "components/icons/ExternalLinkIcon";
import MaleAffectedIcon from "components/icons/MaleAffectedIcon";
import MaleNotAffectedIcon from "components/icons/MaleNotAffectedIcon";
import FemaleAffectedIcon from "components/icons/FemaleAffectedIcon";
import FemaleNotAffectedIcon from "components/icons/FemaleNotAffectedIcon";
import { getTopBodyElement } from "utils/helper";
import { DonorsEntity, VariantEntity } from "store/graphql/variants/models";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/constants";

import style from "./index.module.scss";
import { ArrangerEdge } from "store/graphql/models";

interface OwnProps {
  patientId: string;
  data: VariantEntity;
  opened?: boolean;
  toggle: (opened: boolean) => void;
}

const getDonor = (patientId: string, data: VariantEntity) => {
  const donors: ArrangerEdge<DonorsEntity>[] = data?.donors?.hits?.edges || [];
  const donor: ArrangerEdge<DonorsEntity> | undefined = donors.find(
    (donor) => donor.node.patient_id == patientId
  );
  return donor?.node;
};

const getParentTitle = (
  who: "mother" | "father",
  id: string,
  affected: boolean
) => {
  let AffectedIcon = null;

  if (affected) {
    AffectedIcon = who == "mother" ? FemaleAffectedIcon : MaleAffectedIcon;
  } else {
    AffectedIcon =
      who == "mother" ? FemaleNotAffectedIcon : MaleNotAffectedIcon;
  }

  return (
    <span className={style.parentStatusTitle}>
      {`${intl.get(`screen.patientvariant.drawer.${who}.genotype`)} ${
        id ? `(${id})` : ""
      }`}
      {affected !== null ? (
        <Tooltip
          placement="right"
          title={
            affected
              ? intl.get("screen.patientvariant.drawer.affected")
              : intl.get("screen.patientvariant.drawer.notaffected")
          }
        >
          <span className={style.parentStatusIconWrapper}>
            <AffectedIcon className={style.parentStatusIcon} />
          </span>
        </Tooltip>
      ) : undefined}
    </span>
  );
};

const OccurenceDrawer = ({
  patientId,
  data,
  opened = false,
  toggle,
}: OwnProps) => {
  const [modalOpened, toggleModal] = useState(false);
  const donor = getDonor(patientId, data);

  return (
    <>
      <Drawer
        title={<Tooltip title={data?.hgvsg}>{data?.hgvsg}</Tooltip>}
        placement="right"
        onClose={() => toggle(!opened)}
        visible={opened}
        closeIcon={<CloseOutlined size={16} />}
        width={500}
        className={style.occurenceDrawer}
        getContainer={() => getTopBodyElement()}
      >
        <Space size={24} direction="vertical">
          <Descriptions column={1} className={style.description}>
            <Descriptions.Item label="Zygosité">
              {donor?.zygosity || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Famille"
            column={1}
            className={style.description}
          >
            <Descriptions.Item
              label={getParentTitle(
                "mother",
                donor?.mother_id!,
                donor?.mother_affected_status!
              )}
            >
              {donor?.mother_calls
                ? donor?.mother_calls.join("/")
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={getParentTitle(
                "father",
                donor?.father_id!,
                donor?.father_affected_status!
              )}
            >
              {donor?.father_calls
                ? donor?.father_calls.join("/")
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.transmission")}
            >
              {intl.get(
                `screen.patientvariant.transmission.${donor?.transmission}`
              ) || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.parental.origin")}
            >
              {DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            title={intl.get("screen.patientvariant.drawer.seq.method")}
            column={1}
            className={style.description}
          >
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.depth.quality")}
            >
              {donor?.qd || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.allprof")}
            >
              {donor?.ad_alt || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.alltotal")}
            >
              {donor?.ad_total || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.allratio")}
            >
              {donor?.ad_ratio
                ? donor?.ad_ratio.toFixed(2)
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.gq")}
            >
              {donor?.gq ? donor.gq : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
          </Descriptions>
          <Divider className={style.drawerDivider} />
          <Button disabled type="primary" onClick={() => toggleModal(true)}>
            {intl.get("screen.patientvariant.drawer.igv.viewer")}
            <ExternalLinkIcon height="14" width="14" className="anticon" />
          </Button>
        </Space>
      </Drawer>
    </>
  );
};

export default OccurenceDrawer;
