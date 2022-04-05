import { useEffect, useState } from 'react';
import useQueryParams from 'hooks/useQueryParams';
import { isBoolTrue } from 'utils/helper';
import { getEnvVariable } from 'utils/config';

const FEATURE_TOGGLE_PREFIX = 'FT_';

const isEnabledFromStorage = (name: string) => isBoolTrue(localStorage.getItem(name));
const isEnabledFromFlags = (paramFlag: string | null) =>
  isBoolTrue(paramFlag) || isBoolTrue(getEnvVariable(`${FEATURE_TOGGLE_PREFIX}${name}`));

const useFeatureToggle = (name: string) => {
  const queryParams = useQueryParams();
  const [isEnabled, setEnabled] = useState(false);

  useEffect(() => {
    const paramFlag = queryParams.get('name');
    const isCached = localStorage.getItem(name) !== null;

    setEnabled(isCached ? isEnabledFromStorage(name) : isEnabledFromFlags(paramFlag));
    // eslint-disable-next-line
  }, []);

  return {
    isEnabled,
    clear: () => {
      setEnabled(false);
      localStorage.removeItem(name);
    },
  };
};

export default useFeatureToggle;
