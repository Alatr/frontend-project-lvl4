import { configureStore } from '@reduxjs/toolkit';
import reducers from '../slices/index.js';

export default function configureAppStore(preloadedState = {}) {
  const store = configureStore({
    reducer: reducers,
    preloadedState,
  });

  return store;
}
