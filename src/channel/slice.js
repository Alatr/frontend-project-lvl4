import { createSelector } from 'reselect';
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import initFetch from '../actions/init-fetch.js';

/* eslint-disable no-param-reassign */
const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    byId: {},
    allIds: [],
    loading: 'idle',
    ui: {},
  },
  reducers: {
    changeCurrentChannelId(state, { payload: { id } }) {
      state.ui.currentChannelId = id;
    },
    addChannel(state, { payload }) {
      state.byId[payload.id] = payload;
      state.allIds.push(payload.id);
    },
    removeChannel(state, { payload: { channelId } }) {
      return {
        ...state,
        byId: _.omit(state.byId, channelId),
        allIds: state.allIds.filter((id) => id !== channelId),
        ui: {
          currentChannelId:
            state.ui.currentChannelId === channelId
              ? state.defaultCurrentChannelId
              : state.ui.currentChannelId,
        },
      };
    },
    renameChannel(state, { payload: { id, name } }) {
      state.byId[id].name = name;
    },
  },
  extraReducers: {
    [initFetch.fulfilled]: (state, { payload: { channels, currentChannelId } }) => ({
      byId: _.keyBy(channels, 'id'),
      allIds: channels.map((channel) => channel.id),
      loading: 'fulfilled',
      ui: { currentChannelId },
      defaultCurrentChannelId: currentChannelId,
    }),
    [initFetch.rejected]: (state, action) => {
      state.loading = 'rejected';
      console.error(action);
    },
  },
});
/* eslint-enable no-param-reassign */

export const {
  actions: {
    changeCurrentChannelId, addChannel, removeChannel, renameChannel,
  },
  reducer,
} = channelsSlice;

const getChannelsState = (state) => state?.channels;

export const getCurrentChannelId = createSelector(
  getChannelsState,
  (state) => state?.ui?.currentChannelId,
);
export const getChannelsById = createSelector(getChannelsState, (state) => state?.byId);
export const getChannelsAllIds = createSelector(getChannelsState, (state) => state?.allIds);

export const getChannels = createSelector(
  getChannelsById,
  getChannelsAllIds,
  (channelsById, channelsAllIds) => channelsAllIds.map((id) => channelsById[id]),
);

export const getCurrentChannelName = createSelector(
  getChannelsById,
  getCurrentChannelId,
  (channels, currentChannelId) => channels[currentChannelId]?.name,
);

export const getDefaultChannelId = createSelector(
  getChannelsState,
  (channelsState) => channelsState?.defaultCurrentChannelId,
);

/* eslint-disable-next-line max-len */
export const getChannelsNames = createSelector(getChannels, (channels) => channels.map(({ name }) => name));
