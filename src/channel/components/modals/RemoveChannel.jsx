import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import { useApiService, useLogger } from '../../index.js';

const RemoveChannel = ({ onHide, modalInfo: { type, channelId: id } }) => {
  const { t } = useTranslation();
  const logger = useLogger();
  const { removeChannel } = useApiService();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Modal
      show={!!type}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header onHide={onHide} closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{t('modal.deleteTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{t('modal.deleteText')}</h5>
        <div className="d-flex justify-content-end">
          <Button disabled={isSubmitting} onClick={onHide} className="me-2" variant="secondary">
            {t('modal.undoBtn')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="danger"
            onClick={() => {
              setIsSubmitting(true);
              removeChannel({ id })
                .then(() => {
                  setIsSubmitting(true);
                  onHide();
                })
                .catch(logger.logError);
            }}
          >
            {t('modal.deleteBtn')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
