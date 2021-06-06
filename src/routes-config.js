import LoginPage from './components/Login.jsx';
import HomePage from './components/Home.jsx';
import NoMatchPage from './components/NoMatch.jsx';

export default {
  homePage: {
    path: '/',
    component: HomePage,
  },
  loginPage: {
    path: '/login',
    component: LoginPage,
  },
  notMatchPage: {
    path: '*',
    component: NoMatchPage,
  },
};
