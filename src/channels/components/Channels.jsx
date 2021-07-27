import React, { useState } from 'react';
import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusSquare } from 'react-bootstrap-icons';
import { changeCurrentChannelId, getChannels, getCurrentChannelId } from '../slice.js';

import getModal from './modals/index.js';

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
  handleChannelChange,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {removable ? (
        <Dropdown>
          <ButtonGroup variant="success" className="w-100">
            <Button
              variant={getSelectedButtonVariant(channelId, currentChannelId)}
              onClick={handleChannelChange(channelId)}
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
          onClick={handleChannelChange(channelId)}
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

const Channels = () => {
  const { t } = useTranslation();
  const channels = useSelector(getChannels);
  const dispatch = useDispatch();
  const currentChannelId = useSelector(getCurrentChannelId);

  const [modalInfo, setModalInfo] = useState({ type: null, channelId: null });
  const hideModal = () => setModalInfo({ type: null, channelId: null });
  const showModal = (type, channelId = null) => setModalInfo({ type, channelId });
  const handleChannelChange = (id) => () => {
    dispatch(changeCurrentChannelId({ id }));
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
          <PlusSquare size={20} />
          <span className="visually-hidden">{t('channel.add')}</span>
        </Button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map(({ id, name, removable }) => (
          <li className="nav-item" key={id}>
            <ChannelItem
              handleChannelChange={handleChannelChange}
              currentChannelId={currentChannelId}
              showModal={showModal}
              id={id}
              name={name}
              removable={removable}
            />
          </li>
        ))}
      </ul>
      {renderModal({ hideModal, modalInfo })}
    </>
  );
};

export default Channels;
