import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { useAuth, useSocket } from '../hooks/index.js';
import initFetch from '../actions/init-fetch.js';
import { addMessage } from '../slices/messages.js';

import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';
// TODO thinking about name fetchInitAction and check warning in webpack console
const actionsCreators = {
  initFetch,
  addMessage,
};

const mapStateToProps = ({ channels, messages }) => {
  const props = {
    channels: channels.allIds.map((id) => channels.byId[id]),
    loadingChannelsStatus: channels.loading,
    currentChannelId: channels.currentChannelId,
    messages: messages.allIds.map((id) => messages.byId[id]),
    messagesQuantity: messages.allIds.length,
    currentChannelName: channels.byId[channels.currentChannelId]?.name,
  };
  return props;
};

// TODO think about separete component with separate redux

const Home = ({
  addMessage: addMessageAction,
  initFetch: initFetchAction,
  currentChannelId,
  loadingChannelsStatus,
  channels,
  messages,
  messagesQuantity,
  currentChannelName,
}) => {
  const auth = useAuth();
  const { socketConnected } = useSocket();

  useEffect(() => {
    initFetchAction();
  }, []);

  if (loadingChannelsStatus === 'rejected') {
    auth.logOut();
  }
  if (loadingChannelsStatus === 'fulfilled') {
    auth.logIn();
  }
  if (loadingChannelsStatus === 'idle' || !socketConnected) {
    return (
      <div className="container flex-grow-1 my-4 overflow-hidden rounded shadow">
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  return (
    <div className="container flex-grow-1 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white">
        <div className="col-2 px-0 pt-5 border-end bg-light">
          <div className="d-flex justify-content-between mb-2 px-4">
            <span>Каналы</span>
            <button type="button" className="p-0 text-primary btn btn-group-vertical">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width={20}
                height={20}
                fill="currentColor"
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ChannelsList channels={channels} currentChannelId={currentChannelId} />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  #
                  {currentChannelName}
                </b>
              </p>
              <span className="text-muted">
                {messagesQuantity}
                {' '}
                сообщений
              </span>
            </div>
            <MessagesList
              addMessage={addMessageAction}
              messages={messages}
              currentChannelId={currentChannelId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, actionsCreators)(Home);
