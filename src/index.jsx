import '../assets/styles/application.scss';
import 'regenerator-runtime/runtime.js';

import { render } from 'react-dom';
import { io } from 'socket.io-client';

import run from './init.jsx';

render(run(io()), document.getElementById('chat'));
