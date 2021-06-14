import React from 'react';

const MessagesList = ({ messages }) => (
  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
    {messages.map(({ username, body, id }) => (
      <div className="text-break mb-2" key={id}>
        <b>{username}</b>
        :
        {body}
      </div>
    ))}
  </div>
);

export default MessagesList;
