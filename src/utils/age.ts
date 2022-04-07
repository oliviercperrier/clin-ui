import { differenceInDays } from 'date-fns';

export const calculateGestationalAgeFromDDM = (value: Date) =>
  Math.round(differenceInDays(new Date(), value) / 7);

export const calculateGestationalAgeFromDPA = (value: Date) =>
  Math.round((40 * 7 - differenceInDays(value, new Date())) / 7);
