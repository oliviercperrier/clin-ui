import React from "react";
import { Col, Layout, Row, Typography } from "antd";
import intl from "react-intl-universal";
import get from "lodash/get";
import IconKit from "react-icons-kit";
import {
  ic_email,
  ic_launch,
  ic_location_on,
  ic_phone,
} from "react-icons-kit/md";

import styles from "./index.module.scss";

const { Text } = Typography;
const ZEPLIN_URL = get(
  window,
  "CLIN.zeplinUrl",
  process.env.REACT_APP_ZEPLIN_URL
);
const FHIR_CONSOLE_URL = get(
  window,
  "CLIN.fhirConsoleUrl",
  process.env.REACT_APP_FHIR_CONSOLE_URL
);

const Footer = () => (
  <Layout.Footer id="footer" className={styles.footer}>
    <Row align="middle" className={styles.footerTop}>
      <div className={styles.footerNav}>
        <Col>
          <Text className={styles.navTitle}>
            {intl.get("footer.navigation.primary.information")}
          </Text>
          <nav>
            <ul>
              <li>
                <a href="#">
                  {intl.get("footer.navigation.primary.documentation")}
                </a>
              </li>
              <li>
                <a href="#">{intl.get("footer.navigation.primary.faq")}</a>
              </li>
              <li className={styles.externalLink}>
                <a href="#">
                  {intl.get("footer.navigation.primary.link")}
                  <IconKit icon={ic_launch} size={16} />
                </a>
              </li>
            </ul>
          </nav>
        </Col>
        <Col>
          <Text className={styles.navTitle}>
            {intl.get("footer.navigation.primary.contact")}
          </Text>
          <nav>
            <ul>
              <li>
                <IconKit icon={ic_phone} size={16} />
                {intl.get("footer.navigation.primary.phone")}
              </li>
              <li>
                <IconKit icon={ic_email} size={16} />
                {intl.get("footer.navigation.primary.email")}
              </li>
              <li>
                <IconKit icon={ic_location_on} size={16} />
                {intl.get("footer.navigation.primary.address")}
              </li>
            </ul>
          </nav>
        </Col>
        <Col>
          <img
            alt="Saint-Justine"
            className={styles.logo}
            src="/assets/logos/chujs-white.svg"
          />
        </Col>
      </div>
    </Row>
    <Row align="middle" className={styles.footerBottom}>
      <div className={styles.footerLogo}>
        <nav>
          <ul>
            <li>
              <a href="#">
                {intl.get("footer.navigation.secondary.accessibility")}
              </a>
            </li>
            <li>
              <a href="#">{intl.get("footer.navigation.secondary.access")}</a>
            </li>
            <li>
              <a href="#">
                {intl.get("footer.navigation.secondary.confidentiality")}
              </a>
            </li>
            <li>
              <a href="#">{intl.get("footer.navigation.secondary.about")}</a>
            </li>
            <li>
              <a href={ZEPLIN_URL} target="_blank">
                Zeppelin
              </a>
            </li>
            <li>
              <a href={FHIR_CONSOLE_URL} target="_blank">
                Fhir
              </a>
            </li>
          </ul>
        </nav>
        <img
          alt="Saint-Justine"
          className={styles.logo}
          src="/assets/logos/msssq.svg"
        />
      </div>
    </Row>
  </Layout.Footer>
);

export default Footer;
