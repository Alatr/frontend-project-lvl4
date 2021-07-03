import '../assets/styles/application.scss';
import 'regenerator-runtime/runtime.js';

import React from 'react';
import { render } from 'react-dom';
import App from './init.jsx';

render(<App />, document.getElementById('chat'));
