import { configureStore } from '@reduxjs/toolkit';
import { driverApi } from './apiSlice';

export const store = configureStore({
  reducer: {
    [driverApi.reducerPath]: driverApi.reducer,
    // ...other reducers if any...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(driverApi.middleware),
});
