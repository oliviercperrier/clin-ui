import React from "react";
import cx from "classnames";
import { Button, Divider, Dropdown, PageHeader } from "antd";
import intl from "react-intl-universal";
import TranslateIcon from "components/icons/TranslateIcon";
import AccountCircleIcon from "components/icons/AccountCircleIcon";
import SupervisorIcon from "components/icons/SupervisorIcon";
import LangMenu from "components/Layout/Header/LangMenu";
import { getUserFirstname } from "utils/helper"; 

import styles from "./index.module.scss";
import useQueryString from "utils/useQueryString";

const Header = () => {
  const { token } = useQueryString();
  const lang = intl.getInitOptions().currentLocale;
  const title = intl.get("header.title");
  const langText = intl.get(`lang.${lang}.short`);
  const userFirstname = getUserFirstname(token as string)

  const getExtra = () => {
    let extras = [];

    if (userFirstname) {
      extras.push(
        <Button
          key="0"
          className={styles.navBtn}
          size="small"
          type="text"
          icon={<SupervisorIcon />}
        >
          {intl.get("header.navigation.patient")}
        </Button>,
        <Divider key="1" className={styles.divider} type="vertical" />,
        <Button
          key="2"
          className={cx(styles.navBtn, styles.noMargin)}
          size="small"
          type="text"
          icon={<AccountCircleIcon/>}
        >
          {userFirstname}
        </Button>
      );
    }

    extras.push(
      <Dropdown
        key="3"
        overlay={<LangMenu selectedLang={lang!} />}
        trigger={["click"]}
        getPopupContainer={(triggerNode: HTMLElement) =>
          triggerNode.parentNode as HTMLElement
        }
      >
        <Button
          size="small"
          className={styles.navBtn}
          type="text"
          icon={<TranslateIcon />}
        >
          {langText}
        </Button>
      </Dropdown>
    );

    return extras;
  };

  return (
    <PageHeader
      className={styles.pageHeader}
      title={
        <img
          className={styles.logo}
          alt={title}
          src="/assets/logos/cqgc-white.svg"
        />
      }
      extra={getExtra()}
    />
  );
};

export default Header;
