import React from "react";
import { IconProps } from ".";

const DiseaseIcon = ({
  className = "",
  width = "16",
  height = "16",
  fill = "#63768F",
}: IconProps) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="7.99992" cy="8.00004" r="6.66667" fill={fill} />
  </svg>
);
export default DiseaseIcon;
