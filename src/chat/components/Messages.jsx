import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { useTranslation } from 'react-i18next';
import { getMessagesCount, getMessagesByCurrentChannelId } from '../slice.js';
import { getCurrentChannelName } from '../../channels/index.js';

const Messages = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef();
  const messages = useSelector(getMessagesByCurrentChannelId);
  const messagesCount = useSelector(getMessagesCount);
  const currentChannelName = useSelector(getCurrentChannelName);

  const scrollToBottom = () => {
    if (messagesEndRef.current?.scrollIntoView) {
      messagesEndRef.current?.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentChannelName]);
  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            #
            {currentChannelName}
          </b>
        </p>
        <span className="text-muted">{t('chat.messagesCount', { count: messagesCount })}</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {messages.map(({ username, body }) => (
          <div className="text-break mb-2" key={_.uniqueId()}>
            <b>{username}</b>
            :
            {body}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default Messages;
