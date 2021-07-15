import LoginPage from './components/pages/Login.jsx';
import HomePage from './components/pages/Home.jsx';
import NoMatchPage from './components/pages/NoMatch.jsx';
import SignupPage from './components/pages/Signup.jsx';

export default {
  homePage: {
    path: '/',
    component: HomePage,
  },
  loginPage: {
    path: '/login',
    component: LoginPage,
  },
  signupPage: {
    path: '/signup',
    component: SignupPage,
  },
  notMatchPage: {
    path: '*',
    component: NoMatchPage,
  },
};
