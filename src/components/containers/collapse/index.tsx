import React from 'react';
import { Collapse } from 'antd';

import style from './index.module.scss';
const { Panel } = Collapse;

const HeaderWithStyle = (header: React.ReactNode | string) => (
  <div className={style.clinCollapsableHeader}>{header}</div>
);

type Props = {
  header: React.ReactNode | string;
  children: React.ReactNode;
  bordered?: boolean;
};

const CollapsePanel = ({ header, children, bordered = false }: Props): React.ReactElement => (
  <Collapse bordered={bordered} defaultActiveKey="1">
    <Panel header={HeaderWithStyle(header)} key={`1`}>
      {children}
    </Panel>
  </Collapse>
);

export default CollapsePanel;
