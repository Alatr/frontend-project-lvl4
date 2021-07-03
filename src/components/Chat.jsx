import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import _ from 'lodash';
import { useSocket } from '@hooks/index.js';
import * as yup from 'yup';

import { useTranslation } from 'react-i18next';

import {
  getMessagesByCurrentChannelId,
  getCurrentChannelId,
  getCurrentChannelName,
  getMessagesCount,
} from '@selectors/index.js';

const mapStateToProps = (state) => {
  const props = {
    messages: getMessagesByCurrentChannelId(state),
    messagesCount: getMessagesCount(state),
    currentChannelId: getCurrentChannelId(state),
    currentChannelName: getCurrentChannelName(state),
  };
  return props;
};

const Chat = ({
  messages, messagesCount, currentChannelId, currentChannelName,
}) => {
  const { socket } = useSocket();
  const inputRef = useRef();
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem('userId'))?.username;
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            #
            {currentChannelName}
          </b>
        </p>
        <span className="text-muted">{t('chat.messagesCount', { count: messagesCount })}</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {messages.map(({ username, body, id }) => (
          <div className="text-break mb-2" key={id}>
            <b>{username}</b>
            :
            {body}
          </div>
        ))}
      </div>
      <div className="border-top mt-auto py-3 px-5">
        <Formik
          initialValues={{ body: '' }}
          validationSchema={yup.object({
            body: yup.string().required(),
          })}
          onSubmit={(values, { resetForm }) => {
            socket.emit(
              'newMessage',
              {
                body: values.body,
                channelId: currentChannelId,
                id: _.uniqueId(),
                username: user,
              },
              () => {
                resetForm();
                inputRef.current.select();
              },
            );
          }}
        >
          {({ isValid, dirty }) => (
            <Form>
              <div className="input-group">
                <Field name="body">
                  {({ field, form: { isSubmitting } }) => (
                    <input
                      type="text"
                      data-testid="new-message"
                      placeholder={t('chat.chatPlaceholder')}
                      className="border-0 form-control"
                      ref={inputRef}
                      disabled={isSubmitting}
                      /* eslint-disable-next-line react/jsx-props-no-spreading */
                      {...field}
                    />
                  )}
                </Field>
                <div className="input-group-append">
                  <button
                    type="submit"
                    className="btn btn-group-vertical"
                    disabled={!isValid || !dirty}
                  >
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
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default connect(mapStateToProps, null)(Chat);
