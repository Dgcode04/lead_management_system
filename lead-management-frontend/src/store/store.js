import { configureStore } from '@reduxjs/toolkit';
import { leadsApi } from './api/leadapi';
import { telecallersApi } from './api/telecallersapi';
import { authApi } from './api/authapi';

export const store = configureStore({
  reducer: {
    [leadsApi.reducerPath]: leadsApi.reducer,
    [telecallersApi.reducerPath]: telecallersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(leadsApi.middleware)
      .concat(telecallersApi.middleware)
      .concat(authApi.middleware),
});

