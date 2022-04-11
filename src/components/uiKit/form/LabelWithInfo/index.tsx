import { InfoCircleOutlined } from '@ant-design/icons';
import { Popover, PopoverProps, Typography } from 'antd';
import cx from 'classnames';

import styles from './index.module.scss';

interface OwnProps {
  title: string;
  className?: string;
  popoverProps?: PopoverProps;
  colon?: boolean;
  size?: 'small' | 'default';
  requiredMark?: boolean;
}

const { Text } = Typography;

const LabelWithInfo = ({
  title,
  popoverProps,
  colon = false,
  size = 'default',
  className = '',
  requiredMark = false,
}: OwnProps) => (
  <Text className={cx(styles.labelWithInfo, className)}>
    {requiredMark && <Text className={styles.requiredMark} type="danger">*</Text>}
    <span className={cx(styles.title, styles[size])}>{title}</span>
    {popoverProps && (
      <Text type="secondary" className={styles.infoIconWrapper}>
        <Popover {...popoverProps}>
          <InfoCircleOutlined />
        </Popover>
      </Text>
    )}
    {colon && <span className={styles.colon}>:</span>}
  </Text>
);

export default LabelWithInfo;
