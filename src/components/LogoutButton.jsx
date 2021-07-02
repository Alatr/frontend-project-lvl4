import React from 'react';
import { useAuth } from '@hooks/index.js';
import { useTranslation } from 'react-i18next';

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
