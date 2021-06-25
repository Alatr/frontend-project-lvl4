import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import initFetch from '../actions/init-fetch.js';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { byId: {}, allIds: [], loading: 'idle' },
  reducers: {},
  extraReducers: {
    [initFetch.fulfilled]: (state, { payload: { channels, currentChannelId } }) => ({
      byId: _.keyBy(channels, 'id'),
      allIds: channels.map((channel) => channel.id),
      loading: 'fulfilled',
      currentChannelId,
    }),
    [initFetch.rejected]: (state, action) => {
      /* eslint-disable-next-line no-param-reassign */
      state.loading = 'rejected';
      console.error(action);
    },
  },
});

const { actions, reducer } = channelsSlice;

export const { test } = actions;

export default reducer;
