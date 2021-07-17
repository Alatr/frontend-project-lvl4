import '../assets/styles/application.scss';
import 'regenerator-runtime/runtime.js';

import { render } from 'react-dom';
import { io } from 'socket.io-client';

import init from './init.jsx';

const run = async () => {
  render(await init(io()), document.getElementById('chat'));
};

run();
