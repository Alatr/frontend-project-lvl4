import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axios from 'axios';
import routesApi from '../routes-api.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {};
};

export const fetchInit = createAsyncThunk('channels/fetchInit', async () => {
  const { data } = await axios.get(routesApi.usersPath(), { headers: getAuthHeader() });
  return data;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { byId: {}, allIds: [], loading: 'idle' },
  reducers: {},
  extraReducers: {
    [fetchInit.fulfilled]: (state, { payload: { messages } }) => ({
      byId: _.keyBy(messages, 'channelId'),
      allIds: messages.map((message) => message.channelId),
    }),
    [fetchInit.rejected]: (state, action) => {
      console.error(action);
    },
  },
});

const { actions, reducer } = messagesSlice;

export const { test } = actions;

export default reducer;
