import { differenceInDays } from 'date-fns';

export const calculateGestationalAgeFromDDM = (value: Date) =>
  differenceInDays(new Date(), value) / 7;

export const calculateGestationalAgeFromDPA = (value: Date) =>
  (40 * 7 - differenceInDays(value, new Date())) / 7;
