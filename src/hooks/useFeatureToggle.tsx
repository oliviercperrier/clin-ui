import { useEffect, useState } from 'react';
import useQueryParams from 'hooks/useQueryParams';
import { isBoolTrue } from 'utils/helper';

const FEATURE_TOGGLE_PREFIX = 'REACT_APP_FT_';

const useFeatureToggle = (name: string) => {
  const queryParams = useQueryParams();
  const [isEnabled, setEnabled] = useState(false);

  const clear = () => {
    setEnabled(false);
    localStorage.removeItem(name);
  };

  useEffect(() => {
    const paramFlag = queryParams.get('name');
    const flag = process.env[`${FEATURE_TOGGLE_PREFIX}${name}`];
    const isCached = localStorage.getItem(name) !== null;

    setEnabled(
      isCached ? isBoolTrue(localStorage.getItem(name)) : isBoolTrue(flag) || isBoolTrue(paramFlag),
    );
    // eslint-disable-next-line
  }, []);

  return {
    isEnabled,
    clear,
  };
};

export default useFeatureToggle;
