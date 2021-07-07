import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import initFetch from '../actions/init-fetch.js';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    byId: {},
    allIds: [],
    loading: 'idle',
    ui: {},
  },
  reducers: {
    /* eslint-disable no-param-reassign */
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
    /* eslint-enable no-param-reassign */
  },
  extraReducers: {
    /* eslint-disable no-param-reassign */
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
    /* eslint-enable no-param-reassign */
  },
});

const { actions, reducer } = channelsSlice;

export const {
  changeCurrentChannelId, addChannel, removeChannel, renameChannel,
} = actions;

export default reducer;
