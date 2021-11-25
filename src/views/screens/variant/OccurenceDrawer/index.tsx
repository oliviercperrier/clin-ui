import React, { useEffect, useRef, useState } from "react";
import { Button, Descriptions, Divider, Space, Drawer, Modal } from "antd";
import intl from "react-intl-universal";
import { CloseOutlined } from "@ant-design/icons";
import ExternalLinkIcon from "components/icons/ExternalLinkIcon";
import { getTopBodyElement } from "utils/helper";
import { DonorsEntity } from "store/graphql/variants/models";
import { DISPLAY_WHEN_EMPTY_DATUM } from "views/screens/variant/constants";

import "jquery-ui-dist/jquery-ui";
import "jquery-ui-dist/jquery-ui.css";
import "igv_wrapper/lib/igv-1.0.9.css";
import igv from "igv_wrapper";

import style from "./index.module.scss";

interface OwnProps {
  data: DonorsEntity;
  opened?: boolean;
  toggle: (opened: boolean) => void;
}

const options: any = {
  palette: ["#00A0B0", "#6A4A3C", "#CC333F", "#EB6841"],
  genome: "hg38",
  locus: "chr8:127,736,588-127,739,371",
  tracks: [
    {
      name: "HG00103",
      url: "https://s3.amazonaws.com/1000genomes/data/HG00103/alignment/HG00103.alt_bwamem_GRCh38DH.20150718.GBR.low_coverage.cram",
      indexURL:
        "https://s3.amazonaws.com/1000genomes/data/HG00103/alignment/HG00103.alt_bwamem_GRCh38DH.20150718.GBR.low_coverage.cram.crai",
      format: "cram",
    },
  ],
};

const OccurenceDrawer = ({ data, opened = false, toggle }: OwnProps) => {
  const [modalOpened, toggleModal] = useState(false);
  const [igvLoaded, setIGVLoaded] = useState(false);
  const igvContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (igvContainerRef.current && !igvLoaded) {
      igv.createBrowser(igvContainerRef.current, options);
      setIGVLoaded(true);
    }
  }, [modalOpened]);

  return (
    <>
      <Drawer
        title={intl.get("screen.patientvariant.category_occurrence")}
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
              {data?.zygosity || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Famille"
            column={1}
            className={style.description}
          >
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.mother.genotype")}
            >
              {data?.mother_calls
                ? data?.mother_calls.join("/")
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.father.genotype")}
            >
              {data?.father_calls
                ? data?.father_calls.join("/")
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.transmission")}
            >
              {data?.transmission || DISPLAY_WHEN_EMPTY_DATUM}
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
              {data?.qd || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.allprof")}
            >
              {data?.ad_alt || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.alltotal")}
            >
              {data?.ad_total || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.get("screen.patientvariant.drawer.allratio")}
            >
              {data?.ad_ratio
                ? `${(data?.ad_ratio * 100).toFixed(1)}%`
                : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
          </Descriptions>
          <Divider className={style.drawerDivider} />
          <Button type="primary" onClick={() => toggleModal(true)}>
            {intl.get("screen.patientvariant.drawer.igv.viewer")}
            <ExternalLinkIcon height="14" width="14" className="anticon" />
          </Button>
        </Space>
      </Drawer>
      <Modal
        width="90vw"
        visible={modalOpened}
        footer={false}
        onCancel={() => toggleModal(false)}
        getContainer={() => getTopBodyElement()}
        className={style.igvModal}
      >
        <div
          id="igvContainer"
          ref={igvContainerRef}
          className={style.igvContainer}
        ></div>
      </Modal>
    </>
  );
};

export default OccurenceDrawer;
