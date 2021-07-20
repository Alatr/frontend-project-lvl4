import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card, Container, Row, Col,
} from 'react-bootstrap';

const NoMatch = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="flex-grow-1">
      <Row className="justify-content-center align-content-center h-100">
        <Col xl={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Card.Title>{t('noMatch.title')}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NoMatch;
