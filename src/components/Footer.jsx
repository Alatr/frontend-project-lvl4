import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/index.js';
import routes from '../routes-config.js';

const Footer = () => {
  const auth = useAuth();
  const { pathname } = useLocation();

  const { t } = useTranslation();
  return (
    pathname === routes.loginPage.path
    && !auth.loggedIn && (
      <div className="card-footer p-4">
        <div className="text-center">
          <span>{t('signup.question')}</span>
          {' '}
          <Link to={routes.signupPage.path}>{t('signup.title')}</Link>
        </div>
      </div>
    )
  );
};

export default Footer;
