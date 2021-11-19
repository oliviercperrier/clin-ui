import { Result } from "antd";
import React from "react";

interface OwnProps {
    title?: string;
    description?: string;
}

const NotFound = ({
    title = "Not Found",
    description = "Resource not found."
}: OwnProps) => (
  <Result
    status="404"
    title={title}
    subTitle={description}
  />
);

export default NotFound;