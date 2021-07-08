/// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockedSocket from 'socket.io-mock';

import init from '../src/init.jsx';

const server = setupServer();
let socket; // eslint-disable-line

const mockInitialData = (_req, res, ctx) => {
  const data = {
    channels: [
      { id: 1, name: 'General' },
      { id: 2, name: 'Random' },
    ],
    messages: [],
    currentChannelId: 1,
  };

  return res(ctx.status(200), ctx.json(data));
};

const mockSignup = (_req, res, ctx) => res(ctx.status(200), ctx.json({ token: 'token', username: 'user' }));

const mockSingin = (_req, res, ctx) => res(ctx.status(201), ctx.json({ token: 'token', username: 'user' }));

beforeAll(() => {
  server.listen({
    onUnhandledRequest: (req) => {
      console.error(`There is no handler for "${req.url.href}"`);
    },
  });
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  socket = new MockedSocket();

  socket.on('newMessage', (message, ack) => {
    socket.emit('newMessage', { ...message, id: 1 });
    ack({ status: 'ok' });
  });

  socket.on('newChannel', (channel, ack) => {
    const data = { ...channel, id: 3, removable: true };
    socket.emit('newChannel', data);
    ack({ status: 'ok', data });
  });

  socket.on('renameChannel', (channel, ack) => {
    socket.emit('renameChannel', { ...channel, removable: true });
    ack({ status: 'ok' });
  });

  socket.on('removeChannel', (channel, ack) => {
    socket.emit('removeChannel', { ...channel, removable: true });
    ack({ status: 'ok' });
  });

  global.localStorage.clear();
  socket.socketClient.volatile = { emit: socket.socketClient.emit.bind(socket.socketClient) };
  const vdom = await init(socket.socketClient);
  render(vdom);
  userEvent.click(await screen.findByText(/Hexlet Chat/i));
});

afterEach(() => {
  server.resetHandlers();
});

describe('auth', () => {
  test('login page on enter as guest', async () => {
    expect(window.location.pathname).toBe('/login');
    expect(await screen.findByLabelText(/Ваш ник/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  test('handle login error', async () => {
    server.use(rest.post('/api/v1/login', (_req, res, ctx) => res(ctx.status(401))));
    expect(screen.queryByText(/Неверные имя пользователя или пароль/i)).not.toBeInTheDocument();
    userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'guest');
    userEvent.type(await screen.findByLabelText(/Пароль/i), 'pass');
    userEvent.click(await screen.findByRole('button', { name: /Войти/i }));

    expect(await screen.findByText(/Неверные имя пользователя или пароль/i)).toBeInTheDocument();
  });

  test('handle login success', async () => {
    server.use(rest.post('/api/v1/login', mockSingin), rest.get('/api/v1/data', mockInitialData));

    userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'guest');
    userEvent.type(await screen.findByLabelText(/Пароль/i), 'pass');
    userEvent.click(await screen.findByRole('button', { name: /Войти/i }));
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  test('handle signup user already exists', async () => {
    server.use(rest.post('/api/v1/signup', (_req, res, ctx) => res(ctx.status(409))));

    userEvent.click(await screen.findByRole('link', { name: /Регистрация/i }));
    await waitFor(() => {
      expect(window.location.pathname).toBe('/signup');
    });

    userEvent.type(await screen.findByLabelText(/Имя пользователя/i), 'guest');
    userEvent.type(await screen.findByLabelText(/^Пароль$/i), '123456');
    userEvent.type(await screen.findByLabelText(/Подтвердите пароль/i), '123456');
    userEvent.click(await screen.findByRole('button', { name: /Зарегистрироваться/i }));
    expect(await screen.findByText(/Такой пользователь уже существует/i)).toBeInTheDocument();
  });

  test('handle signup', async () => {
    server.use(rest.post('/api/v1/signup', mockSignup), rest.get('/api/v1/data', mockInitialData));

    userEvent.click(await screen.findByRole('link', { name: /Регистрация/i }));
    await waitFor(() => {
      expect(window.location.pathname).toBe('/signup');
    });

    userEvent.type(await screen.findByLabelText(/Имя пользователя/i), 'guest');
    userEvent.type(await screen.findByLabelText(/^Пароль$/i), '123456');
    userEvent.type(await screen.findByLabelText(/Подтвердите пароль/i), '123456');
    userEvent.click(await screen.findByRole('button', { name: /Зарегистрироваться/i }));
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});

const loginUser = async () => {
  server.use(rest.post('/api/v1/login', mockSingin), rest.get('/api/v1/data', mockInitialData));
  userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'user');
  userEvent.type(await screen.findByLabelText(/Пароль/i), 'pass');
  userEvent.click(await screen.findByRole('button', { name: /Войти/i }));
  await screen.findByTestId('new-message');
};

describe('chatting', () => {
  beforeEach(loginUser);

  test('handle messaging', async () => {
    userEvent.type(await screen.findByTestId('new-message'), 'hi, mentor');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/hi, mentor/i)).toBeInTheDocument();
  });

  test('handle messaging from different chat', async () => {
    userEvent.type(await screen.findByTestId('new-message'), 'hi, mentor from general chat');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/hi, mentor from general chat/i)).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /random/i }));
    expect(screen.queryByText(/hi, mentor from general chat/i)).not.toBeInTheDocument();
    userEvent.type(await screen.findByTestId('new-message'), 'hi, mentor from random chat');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/hi, mentor from random chat/i)).toBeInTheDocument();
  });
  test('add chat', async () => {
    userEvent.click(await screen.findByRole('button', { name: /\+/i }));
    expect(await screen.findByText(/Добавить канал/i)).toBeInTheDocument();
    userEvent.type(await screen.findByTestId('add-channel'), 'new-channel');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/Добавить канал/i)).not.toBeInTheDocument();
  });
  test('rename chat', async () => {
    userEvent.click(await screen.findByRole('button', { name: /\+/i }));
    userEvent.type(await screen.findByTestId('add-channel'), 'new-channel');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    userEvent.click(await screen.findByTestId('dropdown-toggle'));
    userEvent.click(await screen.findByRole('button', { name: /Переименовать/i }));
    expect(await screen.findByText(/Переименовать канал/i)).toBeInTheDocument();
    userEvent.type(await screen.findByTestId('rename-channel'), 'new-name-channel');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/Переименовать канал/i)).not.toBeInTheDocument();
  });
  test('remove chat', async () => {
    userEvent.click(await screen.findByRole('button', { name: /\+/i }));
    expect(await screen.findByText(/Добавить канал/i)).toBeInTheDocument();
    userEvent.type(await screen.findByTestId('add-channel'), 'new-channel');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    userEvent.click(await screen.findByTestId('dropdown-toggle'));
    userEvent.click(await screen.findByRole('button', { name: /Удалить/i }));
    expect(await screen.findByText(/Удалить канал/i)).toBeInTheDocument();
    userEvent.click(await screen.findByRole('button', { name: /Удалить/i }));
    expect(screen.queryByText(/new-channel/i)).not.toBeInTheDocument();
  });
});

describe('chatting validation', () => {
  beforeEach(loginUser);

  test('add channel', async () => {
    userEvent.click(await screen.findByRole('button', { name: /\+/i }));
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/Обязательное поле/i)).toBeInTheDocument();
    userEvent.type(await screen.findByTestId('add-channel'), 'G');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/От 3 до 20 символов/i)).toBeInTheDocument();
    userEvent.type(await screen.findByTestId('add-channel'), 'eneral');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/Должно быть уникальным/i)).toBeInTheDocument();
  });
  test('rename channel', async () => {
    userEvent.click(await screen.findByRole('button', { name: /\+/i }));
    userEvent.type(await screen.findByTestId('add-channel'), 'new-channel');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    userEvent.click(await screen.findByTestId('dropdown-toggle'));
    userEvent.click(await screen.findByRole('button', { name: /Переименовать/i }));
    userEvent.clear(await screen.findByTestId('rename-channel'));
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/Обязательное поле/i)).toBeInTheDocument();
    userEvent.type(await screen.findByTestId('rename-channel'), 'G');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/От 3 до 20 символов/i)).toBeInTheDocument();
    userEvent.type(await screen.findByTestId('rename-channel'), 'eneral');
    userEvent.click(await screen.findByRole('button', { name: /Отправить/i }));
    expect(await screen.findByText(/Должно быть уникальным/i)).toBeInTheDocument();
  });
});
