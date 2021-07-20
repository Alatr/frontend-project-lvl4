import React, { useContext, createContext } from 'react';

const loggerContext = createContext({});
const { Provider } = loggerContext;

export const useLogger = () => useContext(loggerContext);
/* eslint-disable-next-line max-len */
const LoggerService = ({ children, logger }) => (
  <Provider value={{ logger, error: logger.error }}>{children}</Provider>
);

export default LoggerService;
