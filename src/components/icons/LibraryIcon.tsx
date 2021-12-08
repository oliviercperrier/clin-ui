import React from "react";
import cx from "classnames";
import { IconProps } from ".";

const LibraryIcon = ({
  className = "",
  width = "18",
  height = "18",
}: IconProps) => (
  <svg
      className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.25 3.75C11.25 4.995 10.245 6 9 6C7.755 6 6.75 4.995 6.75 3.75C6.75 2.505 7.755 1.5 9 1.5C10.245 1.5 11.25 2.505 11.25 3.75ZM2.25 6C4.86 6 7.23 7.0125 9 8.6625C10.77 7.0125 13.14 6 15.75 6V14.25C13.14 14.25 10.77 15.27 9 16.9125C7.23 15.2625 4.86 14.25 2.25 14.25V6Z"
    />
  </svg>
);
export default LibraryIcon;
