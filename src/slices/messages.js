import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import initFetch from '../actions/init-fetch.js';
import { removeChannel } from './channels.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    byId: {},
    allIds: [],
    loading: 'idle',
    ui: {},
  },
  reducers: {
    addMessage(state, { payload }) {
      /* eslint-disable-next-line no-param-reassign */
      state.byId[payload.id] = payload;
      /* eslint-disable-next-line no-param-reassign */
      state.allIds = _.uniq(state.allIds.concat(payload.id));

      // state.allIds.push(payload.id);
    },
  },
  extraReducers: {
    [removeChannel](state, { payload: { channelId } }) {
      const removebleMessagesIds = [];
      return {
        ...state,
        byId: _.omitBy(state.byId, (message) => {
          if (message.channelId === channelId) {
            removebleMessagesIds.push(message.id);
          }
          return message.channelId === channelId;
        }),
        allIds: state.allIds.filter((id) => !removebleMessagesIds.includes(id)),
      };
    },
    [initFetch.fulfilled]: (state, { payload: { messages } }) => ({
      byId: _.keyBy(messages, 'id'),
      allIds: messages.map((message) => message.id),
    }),
    [initFetch.rejected]: (state, action) => {
      console.error(action);
    },
  },
});

const { actions, reducer } = messagesSlice;

export const { addMessage } = actions;

export default reducer;
