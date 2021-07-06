import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Formik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import imgSignup from '../../assets/static/images/signup.jpg';
import { useAuth } from '../hooks/index.js';
import api from '../routes-api.js';

const Signup = () => {
  const auth = useAuth();
  const inputRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const [signupFailed, setSignupFailed] = useState(false);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="container-fluid flex-grow-1">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-xl-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={imgSignup} className="rounded-circle" alt="Войти" />
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
                    const { data } = await axios.post(api.signup(), values);
                    localStorage.setItem('userId', JSON.stringify(data));
                    auth.logIn();
                    const { from } = location.state || { from: { pathname: '/' } };
                    history.replace(from);
                  } catch (error) {
                    if (error.isAxiosError && error.response.status === 409) {
                      setSignupFailed(true);
                      inputRef.current.select();
                      return;
                    }
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
                    <h1 className="text-center mb-4">{t('signup.title')}</h1>
                    <div>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          name="username"
                          required
                          id="floatingUsername"
                          className="form-control"
                          autoComplete="username"
                          onChange={handleChange}
                          value={values.username}
                          isInvalid={!!errors.username || signupFailed}
                          ref={inputRef}
                          disabled={isSubmitting}
                          placeholder={t('signup.placeholders.name')}
                        />
                        <Form.Label htmlFor="floatingUsername">
                          {t('signup.placeholders.name')}
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          name="password"
                          required
                          type="password"
                          id="password"
                          className="form-control"
                          autoComplete="current-password"
                          onChange={handleChange}
                          value={values.password}
                          isInvalid={!!errors.password || signupFailed}
                          disabled={isSubmitting}
                          placeholder={t('signup.placeholders.password')}
                        />
                        <Form.Label htmlFor="password">
                          {t('signup.placeholders.password')}
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          name="passwordConfirmation"
                          id="passwordConfirmation"
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
                        <Form.Label htmlFor="passwordConfirmation">
                          {t('signup.placeholders.repeatPassword')}
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {signupFailed && t('errors.alreadyExist')}
                          {!!errors.passwordConfirmation && errors.passwordConfirmation}
                        </Form.Control.Feedback>
                      </Form.Group>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
