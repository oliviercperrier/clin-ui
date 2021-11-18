import React from "react";
import { IconProps } from ".";

const GeneIcon = ({
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
    <path d="M15.3624 15.3626C16.6196 14.1042 17.1837 12.2967 17.0211 10.1476C16.4874 10.0733 15.9388 9.96357 15.3756 9.81024C15.346 9.80208 15.3171 9.79589 15.2875 9.78773C15.3556 10.2992 15.3745 10.7839 15.3486 11.24L13.608 9.49909C13.193 9.47039 12.8014 9.4777 12.4393 9.52384L15.1967 12.2823C15.0107 13.0324 14.6672 13.6704 14.1687 14.1692C13.6693 14.6686 13.0284 15.0104 12.2764 15.1961L9.52272 12.4421C9.47658 12.8048 9.46983 13.1967 9.4988 13.6119L11.2355 15.3489C10.385 15.3967 9.43325 15.285 8.40301 15.0048C5.2954 14.1585 2.66606 14.6098 1 16.2764L2.19342 17.4698C3.41328 16.25 5.46082 15.9532 7.95963 16.634C11.0675 17.4788 13.6966 17.027 15.3624 15.3626ZM14.6163 6.21564C15.1502 6.28991 15.6988 6.39907 16.2623 6.5524C16.2927 6.56056 16.3223 6.56731 16.3521 6.5749C16.2694 5.94641 16.2562 5.35504 16.3147 4.81066L18.3828 6.87959C18.7775 6.88606 19.1485 6.85877 19.4904 6.79322L16.5153 3.81756C16.7125 3.18062 17.0301 2.63286 17.4695 2.19398L16.2758 1C15.0172 2.25869 14.4531 4.0671 14.6163 6.21564ZM7.64735 17.4254C7.73062 18.0567 7.74356 18.6503 7.6842 19.1958L5.61049 17.1215C5.21635 17.1151 4.84555 17.1429 4.50429 17.209L7.48277 20.1884C7.28555 20.8225 6.96849 21.3691 6.53045 21.8071L7.72387 23.0011C8.98256 21.7422 9.54663 19.934 9.38318 17.7855C8.84921 17.7112 8.3006 17.6021 7.73681 17.4487C7.70699 17.4403 7.67773 17.4338 7.64735 17.4254ZM16.0404 7.36658C12.9322 6.52201 10.3031 6.97327 8.63764 8.63821C7.38008 9.89605 6.81573 11.7047 6.97862 13.8533C7.51231 13.9276 8.06091 14.0373 8.62414 14.1906C8.65368 14.1988 8.68266 14.2055 8.7122 14.2131C8.48938 12.535 8.77662 11.1339 9.55029 10.1512L13.2453 13.8477C13.3601 13.7635 13.4695 13.6741 13.5694 13.5745C13.669 13.4746 13.7588 13.3652 13.8426 13.2504L10.1467 9.55535C11.3882 8.5735 13.3016 8.37122 15.597 8.99606C18.7046 9.84231 21.3339 9.39105 23 7.72443L21.8066 6.53102C20.5867 7.75088 18.5392 8.0474 16.0404 7.36658Z" fill={fill}/>
  </svg>
);
export default GeneIcon;
