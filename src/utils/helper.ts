import { PARENT_TYPE, PATIENT_POSITION, GENDER, UNKNOWN_TAG } from 'utils/constants';

// NUMBER

export const isNumber = (n: any) => n && !Number.isNaN(n);

export const toExponentialNotation = (numberCandidate: number, fractionDigits = 2) =>
  numberCandidate ? numberCandidate.toExponential(fractionDigits) : numberCandidate;

// STRING
export const appendBearerIfToken = (token?: string) => (token ? `Bearer ${token}` : '');

export const toKebabCase = (str: string) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
    .map((x: string) => x.toLowerCase())
    .join('-');

// DATE

export const formatTimestampToISODate = (timestamp: number) =>
  new Date(timestamp).toISOString().split('T')[0];

// NAVIGATION

export const navigateTo = (href: string) => {
  /* eslint no-restricted-globals: ["off"] */
  if (top && top.window) {
    // iframe support
    top.window.location.href = href;
  } else {
    window.location.href = href;
  }
};

export const isDevelopmentEnv = () => {
  return process.env.NODE_ENV === 'development';
};

export const getTopBodyElement = () => {
  /* eslint no-restricted-globals: ["off"] */
  if (top && top.window) {
    try {
      return top?.window.document.body;
    } catch {}
  }
  return window.document.body;
};

export const downloadFile = (blob: Blob, filename: string) => {
  const downloadLinkElement = document.createElement('a');
  downloadLinkElement.href = window.URL.createObjectURL(blob);
  downloadLinkElement.download = filename;
  document.body.appendChild(downloadLinkElement);
  downloadLinkElement.click();
  document.body.removeChild(downloadLinkElement);
  URL.revokeObjectURL(downloadLinkElement.href);
};


export const getPatientPosition = (gender: string, position: string) => {
  const loweredPosition = position.toLowerCase() || UNKNOWN_TAG;
  const loweredSex = gender.toLowerCase() || UNKNOWN_TAG;
  if (loweredPosition === PATIENT_POSITION.PARENT && loweredSex !== UNKNOWN_TAG) {
    return loweredSex === GENDER.FEMALE ? PARENT_TYPE.MOTHER : PARENT_TYPE.FATHER;
  }
  return loweredPosition;
};

export const formatLocus = (start: number, chromosome: string, bound?: number) =>
  `chr${chromosome}:${bound ? `${start - bound}-${start + bound}` : start}`;

export const isBoolTrue = (value: number | boolean | string | null) =>
  !!value || 'true' === value?.toString().toLowerCase();

export const isBoolFalse = (value: number | boolean | string) =>
  !value || 'false' === value?.toString().toLowerCase();
