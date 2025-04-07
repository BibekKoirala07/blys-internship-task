import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  userData: {
    id: string | null;
    username: string | null;
    email: string | null;
  } | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set user data and update authentication status
    setUser: (
      state,
      action: PayloadAction<{ id: string; username: string; email: string }>
    ) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
    },
    // Action to clear user data and update authentication status on logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
