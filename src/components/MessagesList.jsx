import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import * as Yup from 'yup';
import _ from 'lodash';

const MessagesList = ({ messages, socket, currentChannelId }) => {
  useEffect(() => {}, []);

  // TODO many render arg
  socket.on('newMessage', (arg) => {
    console.log({ arg }); // world
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: Yup.object({
      body: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      socket.emit('newMessage', {
        body: values.body,
        channelId: currentChannelId,
        username: 'admin',
        id: _.uniqueId(),
      });
    },
  });

  return (
    <>
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
        <Form noValidate onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <Form.Control
              name="body"
              data-testid="new-message"
              placeholder="Введите сообщение..."
              className="border-0 form-control"
              onChange={formik.handleChange}
              value={formik.values.body}
              // isInvalid={authFailed}
              // ref={inputRef}
              // disabled={formik.isSubmitting}
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
        </Form>
      </div>
    </>
  );
};

export default MessagesList;
