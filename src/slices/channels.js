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
    addChannel(state, { payload }) {
      state.byId[payload.id] = payload;
      state.allIds.push(payload.id);
      // TODO check add active
      // state.currentChannelId = payload.id;
    },
    removeChannel(state, { payload: { channelId } }) {
      return {
        ...state,
        byId: _.omit(state.byId, channelId),
        allIds: state.allIds.filter((id) => id !== channelId),
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
