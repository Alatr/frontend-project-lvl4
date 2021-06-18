import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routesApi from './routes-api.js';

export const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {};
};

export const fetchInit = createAsyncThunk('channels/fetchInit', async () => {
  const { data } = await axios.get(routesApi.usersPath(), { headers: getAuthHeader() });
  return data;
});
