import { Result } from "antd";
import React from "react";

interface OwnProps {
  title?: string;
  description?: string;
}

const ServerError = ({
  title = "Server Error",
  description = "An error has occured and we are not able to load content at this time.",
}: OwnProps) => <Result status="500" title={title} subTitle={description} />;

export default ServerError;
