import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import {
  Form, Button, Card, Container, Row, Col, FloatingLabel,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import imgLogin from '../../assets/static/images/login.jpg';
import { useAuth, useLogger } from '../services/index.js';

const Login = () => {
  const auth = useAuth();
  const loginInput = useRef();
  const history = useHistory();
  const location = useLocation();
  const logger = useLogger();

  const { t } = useTranslation();

  const [authFailed, setAuthFailed] = useState(false);
  useEffect(() => {
    loginInput.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object({
      username: yup.string().required(),
      password: yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        await auth.logIn(values);
        const { from } = location.state || { from: { pathname: '/' } };
        history.replace(from);
      } catch (error) {
        console.log({ error });
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          loginInput.current.select();
          return;
        }
        logger.error(error);
        throw error;
      }
    },
  });

  return (
    <>
      <Container fluid className="flex-grow-1">
        <Row className="row justify-content-center align-content-center h-100">
          <Col xl={8} xxl={6}>
            <Card>
              <Card.Body className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img src={imgLogin} className="rounded-circle" alt={t('alts.login')} />
                </div>
                <Form onSubmit={formik.handleSubmit} className="w-50">
                  <Card.Title className="text-center mb-4">{t('login.title')}</Card.Title>
                  <div>
                    <FloatingLabel
                      controlId="username"
                      label={t('login.placeholders.name')}
                      className="mb-3"
                    >
                      <Form.Control
                        name="username"
                        required
                        className="form-control"
                        autoComplete="username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        isInvalid={authFailed}
                        ref={loginInput}
                        disabled={formik.isSubmitting}
                        placeholder={t('login.placeholders.name')}
                      />
                    </FloatingLabel>

                    <FloatingLabel
                      controlId="password"
                      label={t('login.placeholders.password')}
                      className="mb-3"
                    >
                      <Form.Control
                        name="password"
                        required
                        type="password"
                        className="form-control"
                        autoComplete="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        isInvalid={authFailed}
                        disabled={formik.isSubmitting}
                        placeholder={t('login.placeholders.password')}
                      />
                      <Form.Control.Feedback type="invalid">
                        {authFailed && t('errors.auth')}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={formik.isSubmitting}
                    className="w-100"
                  >
                    {t('login.loginButtonText')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {!auth.loggedIn && (
        <div className="card-footer p-4">
          <div className="text-center">
            <span>{t('signup.question')}</span>
            <Link to="/signup">{t('signup.title')}</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
