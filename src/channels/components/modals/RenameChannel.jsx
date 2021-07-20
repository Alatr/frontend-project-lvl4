import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

import { useTranslation } from 'react-i18next';

import { getChannelsNames, getChannelsById } from '../../slice.js';
import { useApiService, useLogger } from '../../../services/index.js';

const RenameChannel = ({ onHide, modalInfo: { type, channelId } }) => {
  const { t } = useTranslation();
  const logger = useLogger();
  const { renameChannel } = useApiService();
  const renameModalInput = useRef();
  const channelNames = useSelector(getChannelsNames);
  const channelsById = useSelector(getChannelsById);

  useEffect(() => {
    renameModalInput.current.select();
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
          onSubmit={async (values, { resetForm }) => {
            try {
              await renameChannel({ name: values.newChannelName, id: channelId });
              resetForm();
              onHide();
            } catch (error) {
              logger.error(error);
            }
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
                ref={renameModalInput}
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
