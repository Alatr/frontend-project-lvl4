import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { fetchInit } from '../api.js';

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
