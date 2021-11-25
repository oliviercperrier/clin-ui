import React from "react";
import { Empty } from "antd";
import intl from "react-intl-universal";

const NoData = () => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={intl.get("screen.variantDetails.panel.emptyTable")}
  />
);

export default NoData;
