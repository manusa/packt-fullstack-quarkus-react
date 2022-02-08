import {configureStore} from '@reduxjs/toolkit';
import {userApi} from './users/api';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(userApi.middleware)
});
