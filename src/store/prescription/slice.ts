import { createSlice } from '@reduxjs/toolkit';
import { initialState } from 'store/prescription/types';

export const PrescriptionState: initialState = {
  isLoading: false,
  modalVisible: false,
};

const prescriptionFormSlice = createSlice({
  name: 'prescriptionForm',
  initialState: PrescriptionState,
  reducers: {
    toggleModal: (state) => {
      state.modalVisible = !state.modalVisible;
    },
  },
  extraReducers: (builder) => {},
});

export const prescriptionFormActions = prescriptionFormSlice.actions;
export default prescriptionFormSlice.reducer;
