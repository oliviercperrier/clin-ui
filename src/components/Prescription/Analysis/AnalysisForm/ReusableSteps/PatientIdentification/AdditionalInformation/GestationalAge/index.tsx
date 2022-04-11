import { Typography } from 'antd';

import styles from './index.module.scss';

interface OwnProps {
  value?: number;
}

const { Text } = Typography;

const GestationalAge = ({ value }: OwnProps) =>
  value ? (
    <Text className={styles.calculatedGestationalAge}>
      Âge gestationnel calculé: {value} semaines
    </Text>
  ) : null;

export default GestationalAge;
