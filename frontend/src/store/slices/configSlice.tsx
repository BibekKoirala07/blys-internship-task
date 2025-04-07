// src/features/config/configSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface ConfigState {
  apiUrl: string;
}

const initialState: ConfigState = {
  apiUrl: "http://localhost:80", // default API URL
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},
});

export default configSlice.reducer;
