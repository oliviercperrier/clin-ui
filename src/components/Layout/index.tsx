import React from "react";
import { Layout as AntLayout } from "antd";
import Header from "components/Layout/Header";
import Footer from "components/Layout/Footer";

import styles from "./index.module.scss";

interface OwnProps {
  children: React.ReactElement;
}

const Layout = ({ children }: OwnProps) => (
  <AntLayout className={styles.mainLayout}>
    <Header />
    <AntLayout.Content className={styles.mainContent}>
      <div id="content">{children}</div>
    </AntLayout.Content>
    <Footer />
  </AntLayout>
);

export default Layout;
