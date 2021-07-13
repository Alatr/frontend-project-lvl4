import { useContext } from 'react';

import { authContext, apiContext, loggerContext } from '../contexts/index.js';

export const useAuth = () => useContext(authContext);
export const useApiService = () => useContext(apiContext);
export const useLogger = () => useContext(loggerContext);
