import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routesApi from '../routes-api.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {};
};

export default createAsyncThunk('channels/initFetch', async () => {
  const { data } = await axios.get(routesApi.usersPath(), { headers: getAuthHeader() });
  return data;
});
