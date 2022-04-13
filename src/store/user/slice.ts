import { createSlice } from '@reduxjs/toolkit';
import { TUserState } from 'store/user/types';
import { fetchPractitionerRole } from './thunks';

export const UserState: TUserState = {
  isLoading: false,
  user: {
    practitionerRoles: [],
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState: UserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPractitionerRole.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPractitionerRole.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = {
        ...state.user,
        practitionerRoles: action.payload
      }
    });
    builder.addCase(fetchPractitionerRole.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
