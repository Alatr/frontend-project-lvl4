import React from 'react';
import { useTranslation } from 'react-i18next';

const NoMatch = () => {
  const { t } = useTranslation();

  return (
    <div className="container-fluid flex-grow-1">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-xl-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <h1>{t('noMatch.title')}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoMatch;
