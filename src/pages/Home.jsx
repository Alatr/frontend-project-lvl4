import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Spinner, Container, Row, Col,
} from 'react-bootstrap';
import { useAuth, useLogger } from '../services/index.js';
import initFetch from '../actions/init-fetch.js';

import { Chat } from '../chat/index.js';
import { Channels, getLoadingChannelsStatus } from '../channels/index.js';

const Home = () => {
  const auth = useAuth();
  const logger = useLogger();
  const dispatch = useDispatch();
  const loadingChannelsStatus = useSelector(getLoadingChannelsStatus);

  useEffect(() => {
    const initInitialData = async () => {
      try {
        await dispatch(initFetch());
      } catch (error) {
        auth.logOut();
        logger.error(error);
      }
    };
    initInitialData();
  }, []);

  if (loadingChannelsStatus !== 'fulfilled') {
    return (
      <Container className="flex-grow-1 my-4 overflow-hidden rounded shadow">
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex-grow-1 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white">
        <Col lg={2} className=" px-0 pt-5 border-end bg-light">
          <Channels />
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <Chat />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
