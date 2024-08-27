import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import * as json from '../../../package.json';

const { author, since, url, docUrl, version } = json as any;

const Footer: React.FC<{ center?: boolean }> = ({ center }) => {
  return (
    <Container className="footer text-center">
      <Row>
        <Col md={{ span: 2, offset: center ? 3 : 6 }}></Col>
        <Col md={{ span: 2 }}>
          <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-body" style={{ color: 'red', textDecoration: 'none' }}>
            EasyLog {version}
          </a>
        </Col>
        <Col md={{ span: 2 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-body" style={{ textDecoration: 'none' }}>
            © {author} {since}
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
