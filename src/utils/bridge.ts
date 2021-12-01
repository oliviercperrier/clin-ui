export const createPrescription = () => {
  window.postMessage({ action: 'createNewPrescription' }, window.origin);
};

export const createNanuqReport = (e: React.ChangeEvent) => {
  window.postMessage({ action: 'createNanuqReport' }, window.origin);
};
