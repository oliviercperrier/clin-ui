import React from 'react';
import cx from 'classnames';
import { Button, Divider, Dropdown, PageHeader, Menu } from 'antd';
import intl from 'react-intl-universal';
import TranslateIcon from 'components/icons/TranslateIcon';
import AccountCircleIcon from 'components/icons/AccountCircleIcon';
import SupervisorIcon from 'components/icons/SupervisorIcon';
import LangMenu from 'components/Layout/Header/LangMenu';
import { useGlobals } from 'store/global';
import { useKeycloak } from '@react-keycloak/web';
import styles from 'components/Layout/Header/index.module.scss';
import { showTranslationBtn } from 'utils/config';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from 'auth/keycloak';

const userMenu = () => (
  <Menu>
    <Menu.Item key="logout">
      <Button
        id="logout-button"
        onClick={() => logout()}
        type="text"
        icon={<LogoutOutlined />}
        className={styles.dropdownNav}
      >
        {`${intl.get('logout')}`}
      </Button>
    </Menu.Item>
  </Menu>
);

const Header = () => {
  const { keycloak } = useKeycloak();
  const { lang } = useGlobals();

  const title = intl.get('header.title');
  const langText = intl.get(`lang.${lang}.short`);
  // @ts-ignore: custom property not recognized (given_name)
  const userFirstname = keycloak?.tokenParsed?.given_name || '';

  const getExtra = () => {
    const extras = [];

    extras.push(
      <Button
        key="0"
        className={styles.navBtn}
        size="small"
        type="link"
        href={'/patient/search'}
        icon={<SupervisorIcon />}
      >
        {intl.get('header.navigation.patient')}
      </Button>,
      <Divider key="1" className={styles.divider} type="vertical" />,
      <Dropdown overlay={userMenu()} trigger={['click']} key="2">
        <Button
          className={cx(styles.navBtn, styles.noMargin)}
          size="small"
          type="text"
          icon={<AccountCircleIcon />}
        >
          {userFirstname}
        </Button>
      </Dropdown>,
    );
    if (showTranslationBtn) {
      extras.push(
        <Dropdown
          key="3"
          overlay={<LangMenu selectedLang={lang!} />}
          trigger={['click']}
          getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
        >
          <Button size="small" className={styles.navBtn} type="text" icon={<TranslateIcon />}>
            {langText}
          </Button>
        </Dropdown>,
      );
    }

    return extras;
  };

  return (
    <PageHeader
      className={styles.pageHeader}
      title={<img className={styles.logo} alt={title} src="/assets/logos/cqgc-white.svg" />}
      extra={getExtra()}
    />
  );
};

export default Header;
