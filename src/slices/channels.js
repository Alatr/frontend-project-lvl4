import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import initFetch from '../actions/init-fetch.js';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { byId: {}, allIds: [], loading: 'idle' },
  reducers: {
    /* eslint-disable no-param-reassign */
    changeCurrentChannelId(state, { payload: { id } }) {
      state.currentChannelId = id;
    },
    addChannel(state, { payload: { id } }) {
      state.currentChannelId = id;
    },
    removeChannel(state, { payload: { id } }) {
      state.currentChannelId = id;
    },
    renameChannel(state, { payload: { id } }) {
      state.currentChannelId = id;
    },
    /* eslint-enable no-param-reassign */
  },
  extraReducers: {
    /* eslint-disable no-param-reassign */
    [initFetch.fulfilled]: (state, { payload: { channels, currentChannelId } }) => ({
      byId: _.keyBy(channels, 'id'),
      allIds: channels.map((channel) => channel.id),
      loading: 'fulfilled',
      currentChannelId,
    }),
    [initFetch.rejected]: (state, action) => {
      state.loading = 'rejected';
      console.error(action);
    },
    /* eslint-enable no-param-reassign */
  },
});

const { actions, reducer } = channelsSlice;

export const {
  changeCurrentChannelId, addChannel, removeChannel, renameChannel,
} = actions;

export default reducer;
