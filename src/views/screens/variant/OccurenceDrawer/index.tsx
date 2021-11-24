import React, { useState } from "react";
import { Button, Descriptions, Divider, Space, Drawer, Modal } from "antd";
import intl from "react-intl-universal";
import { CloseOutlined } from "@ant-design/icons";
import ExternalLinkIcon from "components/icons/ExternalLinkIcon";

import style from "./index.module.scss";

interface OwnProps {
  opened?: boolean;
  toggle: (opened: boolean) => void;
}

const OccurenceDrawer = ({ opened = false, toggle }: OwnProps) => {
  const [modalOpened, toggleModal] = useState(false);

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
      >
        <Space size={24} direction="vertical">
          <Descriptions column={1} className={style.description}>
            <Descriptions.Item label="Zygosité">Zhou Maomao</Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Famille"
            column={1}
            className={style.description}
          >
            <Descriptions.Item label="Génotype Mère">
              Zhou Maomao
            </Descriptions.Item>
            <Descriptions.Item label="Génotype Père">
              1810000000
            </Descriptions.Item>
            <Descriptions.Item label="Transmission">
              Hangzhou, Zhejiang
            </Descriptions.Item>
            <Descriptions.Item label="Origine parental">
              empty
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            title="Métrique de séquençage"
            column={1}
            className={style.description}
          >
            <Descriptions.Item label="Qualité de profondeur">
              Zhou Maomao
            </Descriptions.Item>
            <Descriptions.Item label="Profondeur allégique ALT">
              1810000000
            </Descriptions.Item>
            <Descriptions.Item label="Profondeur total ALT + REF">
              Hangzhou, Zhejiang
            </Descriptions.Item>
            <Descriptions.Item label="Ratio allégique ALT / (ALT+REF)">
              empty
            </Descriptions.Item>
          </Descriptions>
          <Divider className={style.drawerDivider} />
          <Button type="primary" onClick={() => toggleModal(true)}>
            IGV viewer
            <ExternalLinkIcon height="14" width="14" className="anticon" />
          </Button>
        </Space>
      </Drawer>
      <Modal
      width="90vw"

        visible={modalOpened}
        onCancel={() => toggleModal(false)}
        title="Title"
      >
        IGV
      </Modal>
    </>
  );
};

export default OccurenceDrawer;
