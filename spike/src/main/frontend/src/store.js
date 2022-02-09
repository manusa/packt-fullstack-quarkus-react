import {configureStore} from '@reduxjs/toolkit';
import {reducer as layoutReducer} from './layout';
import {api as userApi} from './users';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    layout: layoutReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(userApi.middleware)
});
