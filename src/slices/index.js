import { combineReducers } from '@reduxjs/toolkit';
import channelsReducer from './channels.js';
import messagesReducer from './messages.js';

const reducers = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
});

export default reducers;
