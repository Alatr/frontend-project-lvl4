export default {
  logo: 'Hexlet Chat',
  errors: {
    required: 'Обязательное поле',
    min: 'От 3 до 20 символов',
    max: 'От 3 до 20 символов',
    minPassword: 'Не менее 6 символов',
    notOneOf: 'Должно быть уникальным',
    passwordConfirmation: 'Пароли должны совпадать',
    alreadyExist: 'Такой пользователь уже существует',
    auth: 'Неверные имя пользователя или пароль',
  },
  modal: {
    addTitle: 'Добавить канал',
    deleteTitle: 'Удалить канал',
    renameTitle: 'Переименовать канал',
    deleteText: 'Уверены?',
    undoBtn: 'Отменить',
    sandBtn: 'Отправить',
    deleteBtn: 'Удалить',
  },
  channel: {
    title: 'Каналы',
    remove: 'Удалить',
    rename: 'Переименовать',
    add: '+',
  },
  chat: {
    messagesCount_0: '{{count}} сообщение',
    messagesCount_1: '{{count}} сообщения',
    messagesCount_2: '{{count}} сообщений',
    chatPlaceholder: 'Введите сообщение...',
    sand: 'Отправить',
  },
  signup: {
    title: 'Регистрация',
    question: 'Нет аккаунта?',
    placeholders: {
      name: 'Имя пользователя',
      password: 'Пароль',
      repeatPassword: 'Подтвердите пароль',
    },
    signupButtonText: 'Зарегистрироваться',
  },
  login: {
    title: 'Войти',
    placeholders: {
      name: 'Ваш ник',
      password: 'Пароль',
    },
    loginButtonText: 'Войти',
  },
  logout: {
    logoutButtonText: 'Выйти',
  },
  noMatch: {
    title: 'page not found -  error 404',
  },
  alts: {
    login: 'Войти',
    signup: 'Войти',
  },
};
