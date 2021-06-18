import { combineReducers, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import channelsReducer from './channels.js';
import messagesReducer from './messages.js';
import routesApi from '../routes-api.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {};
};

export const fetchInit = createAsyncThunk('channels/fetchInit', async () => {
  const { data } = await axios.get(routesApi.usersPath(), { headers: getAuthHeader() });
  return data;
});

export const aaa = { a: 123 };

export const reducers = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
});
