import { createAsyncThunk } from '@reduxjs/toolkit';
import { loggedFetch, routesApi as api, useLogger } from '../services/index.js';
/* eslint-disable-next-line consistent-return */
export default createAsyncThunk('channels/initFetch', () => {
  try {
    return loggedFetch(api.usersPath());
  } catch (error) {
    useLogger().error(error);
  }
});
