import {configureStore} from '@reduxjs/toolkit';
import {reducer as authReducer} from './auth';
import {reducer as layoutReducer} from './layout';
import {api as userApi} from './users';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    [userApi.reducerPath]: userApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(userApi.middleware)
});
