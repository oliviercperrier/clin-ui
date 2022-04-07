import { InfoCircleOutlined } from '@ant-design/icons';
import { Popover, PopoverProps, Typography } from 'antd';

import styles from './index.module.scss';

interface OwnProps {
  title: string;
  popoverProps: PopoverProps;
}

const { Text } = Typography;

const LabelWithInfo = ({ title, popoverProps }: OwnProps) => (
  <Text className={styles.labelWithInfo}>
    {title}
    <Text type="secondary" className={styles.infoIconWrapper}>
      <Popover {...popoverProps}>
        <InfoCircleOutlined />
      </Popover>
    </Text>
  </Text>
);

export default LabelWithInfo;
