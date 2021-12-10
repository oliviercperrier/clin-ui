import React, { useEffect, useRef, useState } from 'react';
import { IIGVBrowser, IIGVBrowserOptions } from './type';

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

const IGV = ({ id = 'igvContainer', className = '', options, loading = false }: OwnProps) => {
  const igvContainerRef = useRef<HTMLDivElement>(null);
  const [browser, setBrowser] = useState<IIGVBrowser | null>(null);
  const [previousOptions, setPreviousOptions] = useState<IIGVBrowserOptions | null>(null);

  useEffect(() => {
    if (igvContainerRef.current && !browser && options.tracks?.length! > 0) {
      window.igv.createBrowser(igvContainerRef.current, options).then((browser: any) => {
        window.igv.browser = browser;
        setBrowser(browser);
        setPreviousOptions(options);
      });
    }
  }, [options.tracks]);

  useEffect(() => {
    if (browser && previousOptions?.locus !== options.locus) {
      browser.search(options.locus);
    }
  }, [options, previousOptions]);

  return <div id={id} ref={igvContainerRef} className={className}></div>;
};

export default IGV;
