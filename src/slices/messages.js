import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import initFetch from '../actions/init-fetch.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { byId: {}, allIds: [], loading: 'idle' },
  reducers: {
    addMessage(state, { payload }) {
      /* eslint-disable-next-line no-param-reassign */
      state.byId[payload.id] = payload;
      /* eslint-disable-next-line no-param-reassign */
      state.allIds.push(payload.id);
    },
    removeChannel(state, { payload: { channelId } }) {
      console.log('rm channel from mesaages');
      return {
        ...state,
        byId: _.omit(state.byId, channelId),
        allIds: state.allIds.filter((id) => id !== channelId),
      };
    },
  },
  extraReducers: {
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
