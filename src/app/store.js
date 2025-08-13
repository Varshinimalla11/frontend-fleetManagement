import { configureStore } from '@reduxjs/toolkit';
import { tripsApi } from '../features/trips/tripsApi';
import { driveSessionsApi } from '../features/driveSessions/driveSessionsApi';
import { refuelEventsApi } from '../features/refuelEvents/refuelEventsApi';
import { dashboardApi } from '../features/dashboard/dashboardApi';
import { authApi } from '../features/auth/authApi';
import { notificationsApi } from '../features/notifications/notificationsApi';
import { trucksApi } from '../features/trucks/trucksApi';

export const store = configureStore({
  reducer: {
    [tripsApi.reducerPath]: tripsApi.reducer,
    [driveSessionsApi.reducerPath]: driveSessionsApi.reducer,
    [refuelEventsApi.reducerPath]: refuelEventsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
      [trucksApi.reducerPath]: trucksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tripsApi.middleware,
      driveSessionsApi.middleware,
      refuelEventsApi.middleware,
      dashboardApi.middleware,
      authApi.middleware,
      notificationsApi.middleware,
        trucksApi.middleware
    ),
});
