import { createAsyncThunk } from '@reduxjs/toolkit';
import { loggedFetch, routesApi as api } from '../services/index.js';

export default createAsyncThunk('channels/initFetch', () => loggedFetch(api.usersPath()));
