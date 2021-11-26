import { Typography } from "antd";

import styles from "./Header.module.scss";

const { Title } = Typography;

type ContentHeaderProps = {
  title: string;
};

const ContentHeader = ({ title }: ContentHeaderProps): React.ReactElement => (
  <div className={styles.contentHeader}>
    <Title level={3}>{title}</Title>
  </div>
);

export default ContentHeader;
