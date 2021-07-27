import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth-service.jsx';
import routes from '../routes-config.js';

const Header = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={routes.homePage.path}>
          {t('logo')}
        </Link>
        {auth.loggedIn && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              auth.logOut();
            }}
          >
            {t('logout.logoutButtonText')}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
