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
  const isLastPage = page >= total / size;
  const hasLessThanPageSize = total % size > 0;
  const from = (page - 1) * size + 1;
  const to = from + (isLastPage && hasLessThanPageSize ? total % size : size) - 1;

  return (
    <div className={cx(className, style.itemCount)}>
      {(to < size && page === 1) || total === 0 ? (
        <Typography.Text>
          {intl.getHTML('component.table.itemcount.results.one.page', { count: total || 0 })}
        </Typography.Text>
      ) : (
        <Typography.Text>
          {intl.getHTML('component.table.itemcount.results.multiple.pages', {
            from: from,
            to: to,
            total: total,
          })}
        </Typography.Text>
      )}
    </div>
  );
};
