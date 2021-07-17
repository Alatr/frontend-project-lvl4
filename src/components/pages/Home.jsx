import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../../services/auth-service.jsx';
import initFetch from '../../actions/init-fetch.js';

import { Chat } from '../../chat/index.js';
import { Channels, getLoadingChannelsStatus } from '../../channel/index.js';

const actionsCreators = {
  initFetch,
};

const Home = ({ initFetch: initFetchAction }) => {
  const auth = useAuth();
  const loadingChannelsStatus = useSelector(getLoadingChannelsStatus);

  useEffect(() => {
    initFetchAction();
  }, []);

  useEffect(() => {
    if (loadingChannelsStatus === 'rejected') {
      auth.logOut();
    }
    if (loadingChannelsStatus === 'fulfilled') {
      auth.logIn();
    }
  }, [loadingChannelsStatus]);

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

export default connect(null, actionsCreators)(Home);
