import { RootState } from "store/types";
import { initialState } from "store/prescription/types";

export type TPrescriptionProps = initialState;

export const prescriptionSelector = (state: RootState) => {
  return state.prescription;
};