import React from 'react';
import { Menu } from 'antd';
import intl from 'react-intl-universal';
import { LANG } from 'utils/constants';
import { useDispatch } from 'react-redux';
import { globalActions } from 'store/global';

interface OwnProps {
  selectedLang: string;
}

const LangMenu = ({ selectedLang = LANG.EN }: OwnProps) => {
  const dispatch = useDispatch();

  return (
    <Menu
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement}
      selectedKeys={[selectedLang]}
    >
      <Menu.Item
        key={LANG.FR}
        onClick={() => {
          dispatch(globalActions.changeLang(LANG.FR));
        }}
      >
        {intl.get('lang.fr.long')}
      </Menu.Item>

      <Menu.Item
        key={LANG.EN}
        onClick={() => {
          dispatch(globalActions.changeLang(LANG.EN));
        }}
      >
        {intl.get('lang.en.long')}
      </Menu.Item>
    </Menu>
  );
};

export default LangMenu;
