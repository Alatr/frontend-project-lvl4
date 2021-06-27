import { createSelector } from 'reselect';

// channels
const getChannelsState = (state) => state?.channels;

export const getCurrentChannelId = createSelector(
  getChannelsState,
  (state) => state?.currentChannelId,
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

// messages
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
