// import fs from 'fs';
// import path from 'path';
// import { screen, waitFor } from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
// import nock from 'nock';

import app from '../src/app.js';

describe('app', () => {
  test('testing test', () => {
    expect(app()).toEqual(7);
  });
});
