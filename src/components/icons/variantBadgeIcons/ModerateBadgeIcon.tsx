import React from 'react';

import { IconProps } from 'components/icons';

const ModerateBadgeIcon = ({ svgClass = '' }: IconProps) => (
  <svg
    className={svgClass}
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 5.00012L5 10.0001L0 5.00012L5 0.00012207L10 5.00012Z" />
  </svg>
);

export default ModerateBadgeIcon;
