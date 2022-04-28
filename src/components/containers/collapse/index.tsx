import Collapse, { CollapsePanel as FUICollapsePanel } from '@ferlab/ui/core/components/Collapse';
import React from 'react';

type Props = {
  header: React.ReactNode | string;
  children: React.ReactNode;
  bordered?: boolean;
};

const CollapsePanel = ({ header, children, bordered = false }: Props): React.ReactElement => (
  <Collapse bordered={bordered} headerBorderOnly defaultActiveKey="1">
    <FUICollapsePanel header={header} key={`1`}>
      {children}
    </FUICollapsePanel>
  </Collapse>
);

export default CollapsePanel;
