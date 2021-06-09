import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index.js';

export default function configureAppStore(preloadedState = []) {
  const store = configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(loggerMiddleware),
    preloadedState,
    // enhancers: [monitorReducersEnhancer],
  });

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }

  return store;
}
