// src/features/config/configSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface ConfigState {
  apiUrl: string;
}

const initialState: ConfigState = {
  apiUrl: import.meta.env.VITE_BACKEND_URL,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},
});

export default configSlice.reducer;
