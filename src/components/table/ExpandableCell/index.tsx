import React, { useState } from 'react';
import { Typography } from 'antd';
import intl from 'react-intl-universal';

import styles from './index.module.scss';

type OwnProps = {
  nOfElementsWhenCollapsed?: number;
  // must be immutable since we use index as key
  dataSource: (string[] | string[][]) | React.ReactNode[];
  renderItem?: (
    item: (string | string[] | string[][]) | (React.ReactNode | React.ReactNode[]),
    id: string,
  ) => React.ReactNode;
};

const DEFAULT_NUM_COLLAPSED = 3;

const renderItemDefault = (item: React.ReactNode | React.ReactNode[], id: string) => (
  <span key={id}>{item}</span>
);

const ExpandableCell = ({
  nOfElementsWhenCollapsed = DEFAULT_NUM_COLLAPSED,
  dataSource = [],
  renderItem = renderItemDefault,
}: OwnProps) => {
  const [showAll, setShowAll] = useState(false);
  const dataTotalLength = dataSource?.length || 0;
  const sliceNum = showAll ? dataTotalLength : nOfElementsWhenCollapsed;
  const showButton = dataTotalLength > nOfElementsWhenCollapsed;
  const slicedData = dataSource.slice(0, sliceNum);
  return (
    <>
      {slicedData.map((item, index: number) => renderItem(item, `${index} `))}
      {showButton && (
        <Typography.Link className={styles.tableCellButton} onClick={() => setShowAll(!showAll)}>
          {intl.get(showAll ? 'see.less' : 'see.more')}
        </Typography.Link>
      )}
    </>
  );
};

export default ExpandableCell;
