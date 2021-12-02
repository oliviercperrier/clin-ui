import React from "react";
import { IconProps } from ".";

const DiseaseIcon = ({
  className = "",
  width = "16",
  height = "16",
}: IconProps) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.41659 13.3334H14.0833V2.66671H3.41659V13.3334ZM15.4166 14.6667V1.33337H2.08325V14.6667H15.4166Z"
    />
  </svg>
);
export default DiseaseIcon;
