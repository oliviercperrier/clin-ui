import React from 'react';
import cx from 'classnames';
import { IconProps } from '.';

const RqdmIcon = ({ className = '', width = '24', height = '24' }: IconProps) => (
  <svg
    className={cx('anticon', className)}
    width={width}
    height={height}
    viewBox="0 0 16 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M8 0C2.67 4.55 0 8.48 0 11.8C0 16.78 3.8 20 8 20C12.2 20 16 16.78 16 11.8C16 8.48 13.33 4.55 8 0ZM9 16.91C8.68 16.97 8.35 17 8 17C5.31 17 3.12 15.06 3 12H4.5C4.58 14.07 6 15.5 8 15.5C8.35 15.5 8.69 15.46 9 15.37V16.91Z" />
  </svg>
);
export default RqdmIcon;
