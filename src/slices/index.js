import { combineReducers } from '@reduxjs/toolkit';
import channelsReducer from './channels.js';
import messagesReducer from './messages.js';

export default combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
});
