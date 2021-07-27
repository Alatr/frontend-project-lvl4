import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { ArrowRightSquare } from 'react-bootstrap-icons';

import { useTranslation } from 'react-i18next';
import { useApiService, useLogger, useAuth } from '../../services/index.js';
import { getCurrentChannelId, getCurrentChannelName } from '../../channels/index.js';

const AddMessageForm = () => {
  const auth = useAuth();
  const { addMessage } = useApiService();
  const logger = useLogger();
  const { t } = useTranslation();
  const addMessageInput = useRef();

  const currentChannelId = useSelector(getCurrentChannelId);
  const currentChannelName = useSelector(getCurrentChannelName);
  const user = auth.getUserName();

  useEffect(() => {
    addMessageInput.current.focus();
  }, [currentChannelName]);

  return (
    <div className="border-top mt-auto py-3 px-5">
      <Formik
        initialValues={{ body: '' }}
        validationSchema={yup.object({
          body: yup.string().required(),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            await addMessage({
              body: values.body,
              channelId: currentChannelId,
              username: user,
            });
            resetForm();
            addMessageInput.current.select();
          } catch (error) {
            logger.error(error);
          }
        }}
      >
        {({
          handleSubmit, handleChange, values, isSubmitting, isValid, dirty,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <div className="input-group">
              <Form.Control
                type="text"
                name="body"
                className="border-0 form-control"
                value={values.body}
                onChange={handleChange}
                placeholder={t('chat.chatPlaceholder')}
                ref={addMessageInput}
                disabled={isSubmitting}
                data-testid="new-message"
              />
              <div className="input-group-append">
                <Button
                  variant="outline"
                  type="submit"
                  className="btn btn-group-vertical"
                  disabled={!isValid || !dirty}
                >
                  <ArrowRightSquare size={20} fill="currentColor" />
                  <span className="visually-hidden">{t('chat.sand')}</span>
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMessageForm;
