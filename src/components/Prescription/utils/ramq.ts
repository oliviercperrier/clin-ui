export const RAMQ_PATTERN = RegExp(/^[a-zA-Z-]{4}\d{8,8}$/);
export const RAMQ_NUMBER_LENGTH = 12;

export const isRamqValid = (ramq: string) => RAMQ_PATTERN.test(ramq.replaceAll(' ', ''));

export const formatRamq = (value: string) =>
  value
    .toUpperCase()
    .replace(/\s/g, '')
    .split('')
    .splice(0, RAMQ_NUMBER_LENGTH)
    .reduce(
      (acc, char, index) =>
        char !== ' ' && [3, 7].includes(index) ? `${acc}${char} ` : `${acc}${char}`,
      '',
    )
    .trimEnd();
