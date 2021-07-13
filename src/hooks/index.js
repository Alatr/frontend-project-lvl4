import { useContext } from 'react';

import { authContext, socketContext, rollbarContext } from '../contexts/index.js';

export const useAuth = () => useContext(authContext);
export const useSocket = () => useContext(socketContext);
export const useRollbar = () => useContext(rollbarContext);
