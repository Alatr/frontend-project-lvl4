import React, { useContext, createContext } from 'react';

const loggerContext = createContext({});
export const useLogger = () => useContext(loggerContext);

const LoggerService = ({ children, logger }) => {
  const logError = (error) => {
    logger.error(error);
    console.error(error);
  };

  return <loggerContext.Provider value={{ logger, logError }}>{children}</loggerContext.Provider>;
};

export default LoggerService;
