import { useContext } from 'react';

import { authContext, apiContext, rollbarContext } from '../contexts/index.js';

export const useAuth = () => useContext(authContext);
export const useApiService = () => useContext(apiContext);
export const useRollbar = () => useContext(rollbarContext);
