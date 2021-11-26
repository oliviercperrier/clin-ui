import React from "react";
import { Menu } from "antd";
import intl from "react-intl-universal";
import { LANG } from "utils/constants";

interface OwnProps {
  selectedLang: string;
}

const LangMenu = ({ selectedLang = LANG.EN }: OwnProps) => {
  //const dispatch = useDispatch();

  return (
    <Menu
      getPopupContainer={(triggerNode: HTMLElement) =>
        triggerNode.parentNode as HTMLElement
      }
      selectedKeys={[selectedLang]}
    >
      <Menu.Item
        key={LANG.FR}
        onClick={() => {
          //dispatch(changeLanguage(LANG.FR));
        }}
      >
        {intl.get("lang.fr.long")}
      </Menu.Item>

      <Menu.Item
        key={LANG.EN}
        onClick={() => {
          //dispatch(changeLanguage(LANG.EN));
        }}
      >
        {intl.get("lang.en.long")}
      </Menu.Item>
    </Menu>
  );
};

export default LangMenu;
