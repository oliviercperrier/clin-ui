export const transformNameIfNeeded = (field: string, fkey: string, name: string) => {
  if (field.includes('lastNameFirstName') && fkey) {
    const nameSplit = fkey.split(',');
    return `${nameSplit[0].toUpperCase()} ${nameSplit[1]}`;
  } else if (field === 'chromosome') {
    return name === 'true' ? '1' : name;
  }
  return name;
};
