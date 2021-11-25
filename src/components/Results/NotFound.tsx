import React from "react";
import { Result } from "antd";
import intl from "react-intl-universal";

interface OwnProps {
  title?: string;
  description?: string;
}

const NotFound = ({ title, description }: OwnProps) => (
  <Result
    status="404"
    title={title ? title : intl.get("result.notfound.error.title")}
    subTitle={
      description ? description : intl.get("result.notfound.error.description")
    }
  />
);

export default NotFound;
