import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/index.js';

const LogoutButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.loggedIn && (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          auth.logOut();
        }}
      >
        {t('logout.logoutButtonText')}
      </button>
    )
  );
};

export default LogoutButton;
