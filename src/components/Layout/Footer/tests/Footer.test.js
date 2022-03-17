import React from 'react';
import renderer from 'react-test-renderer';
import intl from 'react-intl-universal';
import locales from 'locales';
import Footer from '../index';

require('intl/locale-data/jsonp/fr.js');
intl.init({ locales, currentLocale: "fr" });

describe('Footer', () => {
  test('should be as the snapshot', () => {
    const component = renderer.create(
      <Footer />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});