import axios from 'axios';
import React, { useState, useEffect } from 'react';
import routesApi from '../routes-api';
import useAuth from '../hooks/index.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Home = () => {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const fetchAccess = async () => {
    try {
      const { data } = await axios.get(routesApi.usersPath(), { headers: getAuthHeader() });
      setUserInfo(data);
      auth.logIn();
    } catch (error) {
      auth.logOut();
      console.error(error.response);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, []);
  console.log('====================================');
  console.log({ userInfo });
  console.log('====================================');

  return <h1>home</h1>;
};

export default Home;
