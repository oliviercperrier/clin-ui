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
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.24992 13.3334C11.1954 13.3334 13.5833 10.9456 13.5833 8.00004C13.5833 5.05452 11.1954 2.66671 8.24992 2.66671C5.3044 2.66671 2.91659 5.05452 2.91659 8.00004C2.91659 10.9456 5.3044 13.3334 8.24992 13.3334ZM8.24992 14.6667C11.9318 14.6667 14.9166 11.6819 14.9166 8.00004C14.9166 4.31814 11.9318 1.33337 8.24992 1.33337C4.56802 1.33337 1.58325 4.31814 1.58325 8.00004C1.58325 11.6819 4.56802 14.6667 8.24992 14.6667Z"
      fill={fill}
    />
  </svg>
);
export default DiseaseIcon;
