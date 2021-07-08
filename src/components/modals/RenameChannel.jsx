import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.js';

import { getChannelsNames, getChannelsById } from '../../selectors/index.js';

const RenameChannel = ({ onHide, modalInfo: { type, channelId } }) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const inputRef = useRef();
  const channelNames = useSelector(getChannelsNames);
  const channelsById = useSelector(getChannelsById);

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  return (
    <Modal
      show={!!type}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header onHide={onHide} closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{t('modal.renameTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={yup.object({
            newChannelName: yup.string().required().min(3).max(20)
              .notOneOf(channelNames),
          })}
          onSubmit={(values, { resetForm }) => {
            socket.volatile.emit(
              'renameChannel',
              { name: values.newChannelName, id: channelId },
              () => {
                resetForm();
                onHide();
              },
            );
          }}
          validateOnChange={false}
          initialValues={{
            newChannelName: channelsById[channelId].name,
          }}
        >
          {({
            handleSubmit, handleChange, values, isSubmitting, errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Control
                type="text"
                name="newChannelName"
                className="mb-2"
                value={values.newChannelName}
                onChange={handleChange}
                isInvalid={!!errors.newChannelName}
                ref={inputRef}
                disabled={isSubmitting}
                data-testid="rename-channel"
              />
              <Form.Control.Feedback type="invalid">{errors.newChannelName}</Form.Control.Feedback>
              <div className="d-flex justify-content-end">
                <Button
                  disabled={isSubmitting}
                  onClick={onHide}
                  className="me-2"
                  variant="secondary"
                >
                  {t('modal.undoBtn')}
                </Button>
                <Button disabled={isSubmitting} type="submit" variant="primary">
                  {t('modal.sandBtn')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
