import React, { useState } from 'react';
import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { connect, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { changeCurrentChannelId, getChannels, getCurrentChannelId } from '../index.js';

import getModal from './modals/index.js';

const actionsCreators = {
  changeCurrentChannelIdAction: changeCurrentChannelId,
};

const renderModal = ({ modalInfo, hideModal }) => {
  if (modalInfo.type === null) {
    return null;
  }
  const Modal = getModal(modalInfo.type);
  return <Modal onHide={hideModal} modalInfo={modalInfo} />;
};

const getSelectedButtonVariant = (id, selectedId) => (id === selectedId ? 'secondary' : 'light');

const ChannelItem = ({
  removable,
  id: channelId,
  currentChannelId,
  showModal,
  name,
  changeChannelHandle,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {removable ? (
        <Dropdown>
          <ButtonGroup variant="success" className="w-100">
            <Button
              variant={getSelectedButtonVariant(channelId, currentChannelId)}
              onClick={changeChannelHandle(channelId)}
              className="w-100 px-4 rounded-0 text-start btn"
            >
              <span className="me-1">#</span>
              {name}
            </Button>
            <Dropdown.Toggle
              variant={getSelectedButtonVariant(channelId, currentChannelId)}
              data-testid="dropdown-toggle"
              split
            />
          </ButtonGroup>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => showModal('removing', channelId)}>
              {t('channel.remove')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => showModal('renaming', channelId)}>
              {t('channel.rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          type="button"
          onClick={changeChannelHandle(channelId)}
          variant={getSelectedButtonVariant(channelId, currentChannelId)}
          className="w-100 px-4 rounded-0 text-start btn"
        >
          <span className="me-3">#</span>
          {name}
        </Button>
      )}
    </>
  );
};

const Channels = ({ changeCurrentChannelIdAction }) => {
  const { t } = useTranslation();
  const channels = useSelector(getChannels);
  const currentChannelId = useSelector(getCurrentChannelId);

  const [modalInfo, setModalInfo] = useState({ type: null, channelId: null });
  const hideModal = () => setModalInfo({ type: null, channelId: null });
  const showModal = (type, channelId = null) => setModalInfo({ type, channelId });

  const changeChannelHandle = (id) => () => {
    changeCurrentChannelIdAction({ id });
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-2 px-4">
        <span>{t('channel.title')}</span>
        <Button
          variant="outline"
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
          <span className="visually-hidden">{t('channel.add')}</span>
        </Button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map((channelData) => (
          <li className="nav-item" key={channelData.id}>
            <ChannelItem
              changeChannelHandle={changeChannelHandle}
              currentChannelId={currentChannelId}
              showModal={showModal}
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...channelData}
            />
          </li>
        ))}
      </ul>
      {renderModal({ hideModal, modalInfo })}
    </>
  );
};

export default connect(null, actionsCreators)(Channels);
