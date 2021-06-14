import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices/index.js';

export default function configureAppStore(preloadedState = {}) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return store;
}
