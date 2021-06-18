import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { fetchInit } from '../api.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { byId: {}, allIds: [], loading: 'idle' },
  reducers: {},
  extraReducers: {
    [fetchInit.fulfilled]: (state, { payload: { messages } }) => ({
      byId: _.keyBy(messages, 'id'),
      allIds: messages.map((message) => message.id),
    }),
    [fetchInit.rejected]: (state, action) => {
      console.error(action);
    },
  },
});

const { actions, reducer } = messagesSlice;

export const { test } = actions;

export default reducer;
