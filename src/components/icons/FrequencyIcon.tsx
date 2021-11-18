import React from "react";
import { IconProps } from ".";

const FrequencyIcon = ({
  className = "",
  width = "24",
  height = "24",
  fill
}: IconProps) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.8125 18.5625H4.6875V3.9375C4.6875 3.83437 4.60312 3.75 4.5 3.75H3.1875C3.08437 3.75 3 3.83437 3 3.9375V20.0625C3 20.1656 3.08437 20.25 3.1875 20.25H20.8125C20.9156 20.25 21 20.1656 21 20.0625V18.75C21 18.6469 20.9156 18.5625 20.8125 18.5625ZM7.16719 14.9461C7.23984 15.0188 7.35703 15.0188 7.43203 14.9461L10.6734 11.7211L13.6641 14.7305C13.7367 14.8031 13.8562 14.8031 13.9289 14.7305L20.3836 8.27813C20.4563 8.20547 20.4563 8.08594 20.3836 8.01328L19.4555 7.08516C19.4202 7.05026 19.3726 7.03069 19.323 7.03069C19.2735 7.03069 19.2259 7.05026 19.1906 7.08516L13.8 12.4734L10.8141 9.46875C10.7788 9.43386 10.7312 9.41428 10.6816 9.41428C10.632 9.41428 10.5845 9.43386 10.5492 9.46875L6.24141 13.7508C6.20651 13.786 6.18694 13.8336 6.18694 13.8832C6.18694 13.9328 6.20651 13.9804 6.24141 14.0156L7.16719 14.9461Z"
      fill={fill}
    />
  </svg>
);
export default FrequencyIcon;
