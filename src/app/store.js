import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    // All your API slices share this single reducer
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Enable features like refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
