import React from "react";
import { IconProps } from ".";

const DiseaseIcon = ({
  className = "",
  width = "16",
  height = "16",
  fill = "#63768F"
}: IconProps) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15.1666 14.6667H1.83325V1.33337H15.1666V14.6667Z" fill={fill}/>

  </svg>
);
export default DiseaseIcon;
