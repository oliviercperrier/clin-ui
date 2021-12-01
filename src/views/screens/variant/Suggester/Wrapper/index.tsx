import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import StackLayout from "@ferlab/ui/core/layout/StackLayout";
import { Space, Tooltip } from "antd";

import style from "./index.module.scss";

type SuggesterWrapperProps = {
  children: React.ReactNode;
  tooltipMessage: string;
  title: string;
};

const SuggesterWrapper = (props: SuggesterWrapperProps) => {
  const { children, tooltipMessage, title } = props;

  return (
    <StackLayout vertical className={style.autoCompleteContainer} fitContent>
      <div id={"anchor-search-bar"} className={style.searchBarWrapper}>
        <Space className={style.suggesterTitleWrapper}>
          <div>
            <div className={style.searchTitle}>{title}</div>
          </div>
          <div>
            <Tooltip
              align={{
                offset: [-12],
              }}
              placement="topLeft"
              title={tooltipMessage}
            >
              <InfoCircleOutlined className={style.searchIconsDisabled} />
            </Tooltip>
          </div>
        </Space>
        {children}
      </div>
    </StackLayout>
  );
};

export default SuggesterWrapper;
