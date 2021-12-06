import React from 'react';
import cx from 'classnames';
import intl from 'react-intl-universal';
import { Typography } from 'antd';

import style from './index.module.scss';

type Props = {
  className?: string;
  page: number;
  size: number;
  total: number;
};

export const ItemsCount = ({ className = '', page, size, total }: Props): React.ReactElement => {
  const from = (page - 1) * size + 1;
  const to = from + size - 1;

  return (
    <div className={cx(className, style.itemCount)}>
      {total < to ? (
        <>
          <Typography.Text strong>{total} </Typography.Text>
          <Typography.Text>
            {total > 1
              ? intl.get('component.table.itemcount.results')
              : intl.get('component.table.itemcount.result')}
          </Typography.Text>
        </>
      ) : (
        <>
          <Typography.Text>{intl.get('component.table.itemcount.results')}</Typography.Text>
          <Typography.Text strong>
            {' '}
            {from} - {to}
          </Typography.Text>
          <Typography.Text> {intl.get('component.table.itemcount.of')}</Typography.Text>
          <Typography.Text strong> {total}</Typography.Text>
        </>
      )}
    </div>
  );
};
