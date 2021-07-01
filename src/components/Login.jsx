import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import imgLogin from '@assets/static/images/login.jpg';
import { useAuth } from '@hooks/index.js';
import * as yup from 'yup';
import api from '../routes-api.js';

const Login = () => {
  const auth = useAuth();
  const inputRef = useRef();
  const history = useHistory();
  const location = useLocation();

  const [authFailed, setAuthFailed] = useState(false);
  useEffect(() => {
    inputRef.current.focus();
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
        const { data } = await axios.post(api.login(), values);
        localStorage.setItem('userId', JSON.stringify(data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        history.replace(from);
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw error;
      }
    },
  });

  return (
    <div className="container-fluid flex-grow-1">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-xl-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={imgLogin} className="rounded-circle" alt="Войти" />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">Войти</h1>
                <div>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      name="username"
                      required
                      id="floatingUsername"
                      className="form-control"
                      autoComplete="username"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={authFailed}
                      ref={inputRef}
                      disabled={formik.isSubmitting}
                    />
                    <Form.Label htmlFor="floatingUsername">Ваш ник</Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      name="password"
                      required
                      type="password"
                      id="floatingPassword"
                      className="form-control"
                      autoComplete="current-password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={authFailed}
                      disabled={formik.isSubmitting}
                    />
                    <Form.Label htmlFor="floatingPassword">Пароль</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      Неверные имя пользователя или пароль
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <Button type="submit" variant="primary" disabled={formik.isSubmitting} block>
                  Войти
                </Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                {' '}
                <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
