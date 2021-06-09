import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import routesApi from '../routes-api';
import useAuth from '../hooks/index.js';
import * as actions from '../actions/index.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {};
};

const actionsCreators = {
  addTodo: actions.addTodo,
};

const mapStateToProps = (state) => {
  const props = {
    tasks: state.todosReducer,
  };
  return props;
};

const Home = ({ addTodo, tasks }) => {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const fetchAccess = async () => {
    try {
      const { data } = await axios.get(routesApi.usersPath(), { headers: getAuthHeader() });
      setUserInfo(data);
      auth.logIn();
      // TODO: init redux store from API
    } catch (error) {
      auth.logOut();
      console.error(error.response);
    }
  };
  console.log('====================================');
  console.log(userInfo, tasks);
  console.log('====================================');

  useEffect(() => {
    fetchAccess();
  }, []);

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
          <ul className="nav flex-column nav-pills nav-fill">
            <li className="nav-item">
              <button type="button" className="w-100 px-4 rounded-0 text-start btn btn-secondary">
                <span className="me-3">#</span>
                general
              </button>
            </li>
            <li className="nav-item">
              <button type="button" className="w-100 px-4 rounded-0 text-start btn">
                <span className="me-3">#</span>
                random
              </button>
            </li>
          </ul>
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># general</b>
              </p>
              <span className="text-muted">19 сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
              <div className="text-break mb-2">
                <b>Maxim</b>
                : wedwed
              </div>
              <div className="text-break mb-2">
                <b>Maxim</b>
                : wdad
              </div>
            </div>
            <div className="border-top mt-auto py-3 px-5">
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  addTodo({ text: 'Submit!!!!!!!!!!!!!!!!!!!!' });
                }}
              >
                <div className="input-group">
                  <input
                    name="body"
                    data-testid="new-message"
                    placeholder="Введите сообщение..."
                    className="border-0 form-control"
                    defaultValue
                  />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-group-vertical">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width={30}
                        height={30}
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                        />
                      </svg>
                      <span className="visually-hidden">Отправить</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, actionsCreators)(Home);
