/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Col, Layout, Row } from 'antd';
import intl from 'react-intl-universal';
import get from 'lodash/get';

import styles from './index.module.scss';

const ZEPLIN_URL = get(window, 'CLIN.zeplinUrl', process.env.REACT_APP_ZEPLIN_URL);
const FHIR_CONSOLE_URL = get(window, 'CLIN.fhirConsoleUrl', process.env.REACT_APP_FHIR_CONSOLE_URL);

const Footer = () => (
  <Layout.Footer id="footer" className={styles.footer}>
    <Row align="middle" justify="space-between">
      <Col>
        <nav>
          <ul>
            <li>
              <a href={ZEPLIN_URL} target="_blank" rel="noreferrer">{intl.get('footer.navigation.zepplin')}</a>
            </li>
            <li>
              <a href={FHIR_CONSOLE_URL} target="_blank" rel="noreferrer">{intl.get('footer.navigation.fhir')}</a>
            </li>
          </ul>
        </nav>
      </Col>
      <Col>
        <img alt="Saint-Justine" className="logo" src="/assets/logos/chujs-color.svg" />
      </Col>
    </Row>
  </Layout.Footer>
);

export default Footer;
