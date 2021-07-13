import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

import { useTranslation } from 'react-i18next';
import { changeCurrentChannelId, getChannelsNames } from '../../index.js';
import { useApiService } from '../../../hooks/index.js';

const AddCannel = ({ onHide, modalInfo: { type } }) => {
  const { t } = useTranslation();
  const { addChannel } = useApiService();
  const inputRef = useRef();
  const dispatch = useDispatch();

  const channelNames = useSelector(getChannelsNames);

  useEffect(() => {
    inputRef.current.focus();
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
        <Modal.Title id="contained-modal-title-vcenter">{t('modal.addTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={yup.object({
            newChannelName: yup
              .string()
              .required()
              .min(3, t('errors.min'))
              .max(20, t('errors.max'))
              .notOneOf(channelNames),
          })}
          onSubmit={(values, { resetForm }) => {
            addChannel({ name: values.newChannelName, removable: true }, ({ data: { id } }) => {
              console.log('cb');
              dispatch(changeCurrentChannelId({ id }));
              resetForm();
              onHide();
            });
          }}
          validateOnChange={false}
          initialValues={{
            newChannelName: '',
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
                data-testid="add-channel"
              />
              <Form.Control.Feedback type="invalid">{errors.newChannelName}</Form.Control.Feedback>
              <div className="d-flex justify-content-end">
                <Button
                  onClick={onHide}
                  disabled={isSubmitting}
                  className="me-2"
                  type="button"
                  variant="secondary"
                >
                  {t('modal.undoBtn')}
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="primary">
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

export default AddCannel;
