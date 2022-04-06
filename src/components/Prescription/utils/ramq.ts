const RAMQ_PATTERN = RegExp(/^[a-zA-Z-]{4}\d{8,9}$/);

export const isRamqValid = (ramq: string) => RAMQ_PATTERN.test(ramq.replaceAll(' ', ''));

export const formatRamq = (value: string) =>
  value
    .toUpperCase()
    .replace(/\s/g, '')
    .split('')
    .reduce(
      (acc, char, index) =>
        char !== ' ' && [3, 7].includes(index) ? `${acc}${char} ` : `${acc}${char}`,
      '',
    )
    .trimEnd();
