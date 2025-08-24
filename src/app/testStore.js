import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';
import { dashboardApi } from '../api/dashboardApi';
import { trucksApi } from '../api/trucksApi';
import { tripsApi } from '../api/tripsApi';
import { authApi } from '../api/authApi';

export const testStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
