import React, { useEffect, useRef, useState } from 'react';
import { IIGVBrowser, IIGVBrowserOptions } from './type';
import cx from "classnames";

import style from "./index.module.scss";

declare global {
  interface Window {
    igv: any;
  }
}

type OwnProps = {
  id?: string;
  className?: string;
  options: IIGVBrowserOptions;
  loading?: boolean;
};

const IGV = ({ id = 'igvContainer', className = '', options }: OwnProps) => {
  const igvContainerRef = useRef<HTMLDivElement>(null);
  const [browser, setBrowser] = useState<IIGVBrowser | null>(null);
  const [previousOptions, setPreviousOptions] = useState<IIGVBrowserOptions | null>(null);

  useEffect(() => {
    if (igvContainerRef.current && !window.igv.browser && options.tracks?.length! > 0) {
      window.igv.browser = true;
      window.igv.createBrowser(igvContainerRef.current, options).then((browser: any) => {
        window.igv.browser = browser;
        setBrowser(browser);
        setPreviousOptions(options);
      });
    }
  }, [options.tracks]);

  useEffect(() => {
    console.log(previousOptions?.locus)
    console.log(options?.locus)

    if (browser && previousOptions?.locus !== options.locus) {
      browser.search(options.locus);
      setPreviousOptions(options)
    }
  }, [options, previousOptions]);

  return <div id={id} ref={igvContainerRef} className={cx(className, style.igvContainer)}></div>;
};

export default IGV;
