import React, { useContext, useCallback, createContext } from 'react';

const host = '';
const prefix = 'api/v1';

export const routesApi = {
  login: () => [host, prefix, 'login'].join('/'),
  signup: () => [host, prefix, 'signup'].join('/'),
  usersPath: () => [host, prefix, 'data'].join('/'),
};

const apiContext = createContext({});
const { Provider } = apiContext;

export const useApiService = () => useContext(apiContext);

const withAcknowledgement = (socketFunc) => (...args) => new Promise((resolve, reject) => {
  // eslint-disable-next-line functional/no-let
  let state = 'pending';
  const timer = setTimeout(() => {
    state = 'rejected';
    reject();
  }, 3000);
  socketFunc(...args, (response) => {
    if (state !== 'pending') return;
    clearTimeout(timer);
    if (response.status === 'ok') {
      state = 'resolved';
      resolve(response.data);
    }
    reject(new Error('Socket response error'));
  });
});

const ApiService = ({ children, api }) => {
  const addChannel = useCallback(
    withAcknowledgement((...args) => api.volatile.emit('newChannel', ...args)),
  );
  const removeChannel = useCallback(
    withAcknowledgement((...args) => api.volatile.emit('removeChannel', ...args)),
  );
  const renameChannel = useCallback(
    withAcknowledgement((...args) => api.volatile.emit('renameChannel', ...args)),
  );
  const addMessage = useCallback(
    withAcknowledgement((...args) => api.volatile.emit('newMessage', ...args)),
  );

  return (
    <Provider
      value={{
        api,
        addChannel,
        removeChannel,
        renameChannel,
        addMessage,
      }}
    >
      {children}
    </Provider>
  );
};

export default ApiService;
