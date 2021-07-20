import LoginPage from './pages/Login.jsx';
import HomePage from './pages/Home.jsx';
import NoMatchPage from './pages/NoMatch.jsx';
import SignupPage from './pages/Signup.jsx';

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
