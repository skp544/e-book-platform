import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, Profile } from "../types";

const initialState: AuthState = {
  status: "unauthenticated",
  profile: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile(state, { payload }: PayloadAction<Profile | null>) {
      state.profile = payload;
    },
  },
});

export const { updateProfile } = slice.actions;

export default slice.reducer;
