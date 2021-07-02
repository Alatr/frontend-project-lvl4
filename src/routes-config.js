import LoginPage from './components/Login.jsx';
import HomePage from './components/Home.jsx';
import NoMatchPage from './components/NoMatch.jsx';
import SignupPage from './components/Signup.jsx';

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
