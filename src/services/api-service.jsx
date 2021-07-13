import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { apiContext } from '../contexts/index.js';

import { addMessage as addMessageAction } from '../chat/index.js';
import {
  addChannel as addChannelAction,
  removeChannel as removeChannelAction,
  renameChannel as renameChannelAction,
} from '../channel/index.js';

const ApiService = ({ children, socket }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('newChannel', (data) => {
      dispatch(addChannelAction(data));
    });
    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannelAction({ channelId: id }));
    });
    socket.on('renameChannel', (data) => {
      dispatch(renameChannelAction(data));
    });
    socket.on('newMessage', (data) => {
      dispatch(addMessageAction(data));
    });
    setSocketConnected(true);
  }, []);

  const addChannel = useCallback((data, cb) => {
    socket.volatile.emit('newChannel', data, cb);
  });
  const removeChannel = useCallback((data, cb) => {
    socket.volatile.emit('removeChannel', data, cb);
  });
  const renameChannel = useCallback((data, cb) => {
    socket.volatile.emit('renameChannel', data, cb);
  });
  const addMessage = useCallback((data, cb) => {
    socket.volatile.emit('newMessage', data, cb);
  });

  return (
    <apiContext.Provider
      value={{
        socket,
        socketConnected,
        addChannel,
        removeChannel,
        renameChannel,
        addMessage,
      }}
    >
      {children}
    </apiContext.Provider>
  );
};

export default ApiService;
