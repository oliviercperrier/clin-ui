import { createSlice } from '@reduxjs/toolkit';
import { TUserState } from 'store/user/types';

export const UserState: TUserState = {
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: UserState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
