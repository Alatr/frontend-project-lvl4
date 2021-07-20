import React, { useState, useRef, useEffect } from 'react';
import { Formik } from 'formik';
import {
  Form, Button, Card, Container, Row, Col, FloatingLabel,
} from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import imgSignup from '../../assets/static/images/signup.jpg';
import { useAuth, useLogger } from '../services/index.js';

const Signup = () => {
  const auth = useAuth();
  const signupInput = useRef();
  const history = useHistory();
  const location = useLocation();
  const logger = useLogger();
  const { t } = useTranslation();

  const [signupFailed, setSignupFailed] = useState(false);
  useEffect(() => {
    signupInput.current.focus();
  }, []);

  return (
    <Container fluid className="flex-grow-1">
      <Row className="justify-content-center align-content-center h-100">
        <Col xl={8} xxl={6}>
          <Card>
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={imgSignup} className="rounded-circle" alt={t('alts.signup')} />
              </div>
              <Formik
                validationSchema={yup.object({
                  username: yup.string().required().min(3, t('errors.min')),
                  password: yup.string().required().min(6, t('errors.minPassword')),
                  passwordConfirmation: yup
                    .string()
                    .required()
                    .min(6, t('errors.minPassword'))
                    .oneOf([yup.ref('password'), null], t('errors.passwordConfirmation')),
                })}
                onSubmit={async (values) => {
                  try {
                    await auth.signUp(values);
                    const { from } = location.state || { from: { pathname: '/' } };
                    history.replace(from);
                  } catch (error) {
                    if (error.isAxiosError && error.response.status === 409) {
                      setSignupFailed(true);
                      signupInput.current.select();
                      return;
                    }
                    logger.error(error);
                    throw error;
                  }
                }}
                initialValues={{
                  username: '',
                  password: '',
                  passwordConfirmation: '',
                }}
              >
                {({
                  handleSubmit, handleChange, values, isSubmitting, errors, isValid, dirty,
                }) => (
                  <Form onSubmit={handleSubmit} className="w-50">
                    <Card.Title className="text-center mb-4">{t('signup.title')}</Card.Title>
                    <div>
                      <FloatingLabel
                        controlId="username"
                        label={t('signup.placeholders.name')}
                        className="mb-3"
                      >
                        <Form.Control
                          name="username"
                          required
                          className="form-control"
                          autoComplete="username"
                          onChange={handleChange}
                          value={values.username}
                          isInvalid={!!errors.username || signupFailed}
                          ref={signupInput}
                          disabled={isSubmitting}
                          placeholder={t('signup.placeholders.name')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                      <FloatingLabel
                        controlId="password"
                        label={t('signup.placeholders.password')}
                        className="mb-3"
                      >
                        <Form.Control
                          name="password"
                          required
                          type="password"
                          className="form-control"
                          autoComplete="current-password"
                          onChange={handleChange}
                          value={values.password}
                          isInvalid={!!errors.password || signupFailed}
                          disabled={isSubmitting}
                          placeholder={t('signup.placeholders.password')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                      <FloatingLabel
                        controlId="passwordConfirmation"
                        label={t('signup.placeholders.repeatPassword')}
                        className="mb-3"
                      >
                        <Form.Control
                          name="passwordConfirmation"
                          required
                          type="password"
                          className="form-control"
                          autoComplete="current-password"
                          onChange={handleChange}
                          value={values.passwordConfirmation}
                          isInvalid={!!errors.passwordConfirmation || signupFailed}
                          disabled={isSubmitting}
                          placeholder={t('signup.placeholders.repeatPassword')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {signupFailed && t('errors.alreadyExist')}
                          {!!errors.passwordConfirmation && errors.passwordConfirmation}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || !isValid || !dirty}
                      className="w-100"
                    >
                      {t('signup.signupButtonText')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
