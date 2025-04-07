// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import configReducer from "./slices/configSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    config: configReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
