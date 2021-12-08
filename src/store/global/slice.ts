import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/global/types';
import { LANG } from 'utils/constants';
import intl from 'react-intl-universal';
import locales from 'locales';

export const GlobalState: initialState = {
  lang: LANG.FR,
};

const globalSlice = createSlice({
  name: 'global',
  initialState: GlobalState,
  reducers: {
    changeLang: (state, action: PayloadAction<LANG>) => ({
      ...state,
      lang: action.payload,
    }),
  },
});

export const globalActions = globalSlice.actions;
export default globalSlice.reducer;
