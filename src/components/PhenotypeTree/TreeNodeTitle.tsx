import { Col, Row, Tag } from 'antd';

import styles from './index.module.scss';

interface OwnProps {
  title: string | React.ReactNode;
  exactTagCount: number;
  totalCount: number;
}

const TreeNodeTitle = (props: OwnProps) => (
  <Row justify="space-between" align="middle">
    <Col>{props.title}</Col>
    <Col style={{ width: 100 }}>
      <Row>
        <Col span={12} className={styles.phenotypeTreeCountTag}>
          <Tag>{props.exactTagCount}</Tag>
        </Col>
        <Col span={12} className={styles.phenotypeTreeCountTag}>
          <Tag>{props.totalCount}</Tag>
        </Col>
      </Row>
    </Col>
  </Row>
);

export default TreeNodeTitle;
