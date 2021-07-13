import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/index.js';
import initFetch from '../actions/init-fetch.js';

import { Chat } from '../chat/index.js';
import { Channels } from '../channel/index.js';

console.log(Chat);
const actionsCreators = {
  initFetch,
};

const mapStateToProps = ({ channels }) => {
  const props = {
    loadingChannelsStatus: channels.loading,
  };
  return props;
};

const Home = ({ loadingChannelsStatus, initFetch: initFetchAction }) => {
  const auth = useAuth();

  useEffect(() => {
    initFetchAction();
  }, []);

  if (loadingChannelsStatus === 'rejected') {
    auth.logOut();
  }
  if (loadingChannelsStatus === 'fulfilled') {
    auth.logIn();
  }
  if (loadingChannelsStatus === 'idle') {
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
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, actionsCreators)(Home);
