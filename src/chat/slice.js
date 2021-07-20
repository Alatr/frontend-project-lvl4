import { createSelector } from 'reselect';

import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import initFetch from '../actions/init-fetch.js';
import { removeChannel, getCurrentChannelId } from '../channels/index.js';

/* eslint-disable no-param-reassign */
const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    byId: {},
    allIds: [],
  },
  reducers: {
    addMessage(state, { payload }) {
      state.byId[payload.id] = payload;
      state.allIds = _.uniq(state.allIds.concat(payload.id));
    },
  },
  extraReducers: {
    [removeChannel](state, { payload: { channelId } }) {
      const removableMessagesIds = [];
      return {
        ...state,
        byId: _.omitBy(state.byId, (message) => {
          if (message.channelId === channelId) {
            removableMessagesIds.push(message.id);
          }
          return message.channelId === channelId;
        }),
        allIds: state.allIds.filter((id) => !removableMessagesIds.includes(id)),
      };
    },
    [initFetch.fulfilled]: (state, { payload: { messages } }) => ({
      byId: _.keyBy(messages, 'id'),
      allIds: messages.map((message) => message.id),
    }),
  },
});
/* eslint-enable no-param-reassign */

export const {
  actions: { addMessage },
  reducer,
} = messagesSlice;

const getMessagesState = (state) => state?.messages;

export const getMessagesById = createSelector(getMessagesState, (state) => state?.byId);
export const getMessagesAllIds = createSelector(getMessagesState, (state) => state?.allIds);

export const getMessages = createSelector(
  getMessagesById,
  getMessagesAllIds,
  (messagesById, messagesAllIds) => messagesAllIds.map((id) => messagesById[id]),
);

export const getMessagesByCurrentChannelId = createSelector(
  getMessages,
  getCurrentChannelId,
  /* eslint-disable-next-line max-len */
  (messages, currentChannelId) => messages.filter(({ channelId }) => channelId === currentChannelId),
);

export const getMessagesCount = createSelector(
  getMessagesByCurrentChannelId,
  (messagesByCurrentChannelId) => messagesByCurrentChannelId.length,
);
