import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import { RootState } from 'store/types';
// Reducers
import GlobalReducer from 'store/global';

const devMode = process.env.NODE_ENV === 'development';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'global'
    /* Add reducer to persist in local storage */
  ],
};

const rootReducer = combineReducers<RootState>({
  global: GlobalReducer,
});

const store: any = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  devTools: devMode,
  middleware: (getDefaultMiddleware) => {
    let defaultMid = getDefaultMiddleware();
    return devMode ? defaultMid.concat(logger) : defaultMid;
  },
});

const persistor = persistStore(store);

export default function getStoreConfig() {
  return { store, persistor };
}
