import React from 'react';
import { loggerContext } from '../contexts/index.js';

const LoggerService = ({ children, rollbar }) => {
  const logError = (error) => {
    rollbar.error(error);
  };
  return <loggerContext.Provider value={{ rollbar, logError }}>{children}</loggerContext.Provider>;
};

export default LoggerService;
