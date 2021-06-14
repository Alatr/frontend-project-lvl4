import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import routesApi from '../routes-api.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {};
};

export const fetchInit = createAsyncThunk('channels/fetchInit', async () => {
  const { data } = await axios.get(routesApi.usersPath(), { headers: getAuthHeader() });
  return data;
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { byId: {}, allIds: [], loading: 'idle' },
  reducers: {},
  extraReducers: {
    [fetchInit.fulfilled]: (state, { payload: { channels, currentChannelId } }) => ({
      byId: _.keyBy(channels, 'id'),
      allIds: channels.map((channel) => channel.id),
      loading: 'fulfilled',
      currentChannelId,
    }),
    [fetchInit.rejected]: (state, action) => {
      /* eslint-disable-next-line no-param-reassign */
      state.loading = 'rejected';
      console.error(action);
    },
  },
});

const { actions, reducer } = channelsSlice;

export const { test } = actions;

export default reducer;
