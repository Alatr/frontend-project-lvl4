import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import {
  changeCurrentChannelId,
  addChannel,
  removeChannel,
  renameChannel,
} from '../slices/channels.js';
import { getChannels, getCurrentChannelId } from '../selectors/index.js';
import getModal from './modals/index.js';

const actionsCreators = {
  changeCurrentChannelIdAction: changeCurrentChannelId,
  addChannelAction: addChannel,
  removeChannelAction: removeChannel,
  renameChannelAction: renameChannel,
};

const mapStateToProps = (state) => {
  const props = {
    channels: getChannels(state),
    currentChannelId: getCurrentChannelId(state),
  };
  return props;
};

const renderModal = ({ modalInfo, hideModal, setChannels }) => {
  if (modalInfo.type === null) {
    return null;
  }

  const Modal = getModal(modalInfo.type);

  return <Modal onHide={hideModal} setChannels={setChannels} />;
};

const Channels = ({
  channels,
  currentChannelId,
  changeCurrentChannelIdAction,
  addChannelAction,
  removeChannelAction,
  renameChannelAction,
}) => {
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });
  const hideModal = () => setModalInfo({ type: null, channel: null });
  const showModal = (type, channel = null) => setModalInfo({ type, channel });

  const changeChannelHandle = (id) => () => {
    changeCurrentChannelIdAction({ id });
  };

  const mapAction = useCallback(
    (modalName) => {
      const modalsActions = {
        adding: addChannelAction,
        removing: removeChannelAction,
        renaming: renameChannelAction,
      };
      return modalsActions[modalName];
    },
    [addChannelAction, removeChannelAction, renameChannelAction],
  );

  return (
    <>
      <div className="d-flex justify-content-between mb-2 px-4">
        <span>Каналы</span>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => showModal('adding')}
        >
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
        {channels.map(({ name, id }) => (
          <li className="nav-item" key={id}>
            <button
              type="button"
              onClick={changeChannelHandle(id)}
              className={classNames('w-100', 'px-4', 'rounded-0', 'text-start', 'btn', {
                'btn-secondary': id === currentChannelId,
              })}
            >
              <span className="me-3">#</span>
              {name}
            </button>
          </li>
        ))}
      </ul>
      {renderModal({ hideModal, modalInfo, setChannels: mapAction(modalInfo.type) })}
    </>
  );
};

export default connect(mapStateToProps, actionsCreators)(Channels);
