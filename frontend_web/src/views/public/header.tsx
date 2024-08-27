import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NotificationValue, { NotificationProvider, useNotificationStore } from '../../components/Notification/ctrl';

const Header: React.FC = () => {
  return (
    <Navbar className="header" expand="lg" fixed="top" bg="white">
      <Container fluid>
        <Navbar.Brand href="/">
          <>
            <img src="/logo.png" alt="logo" />
            EasyLog
          </>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto" style={{ minWidth: 150 }}>
            <Nav.Link href="/">Início</Nav.Link>
          </Nav>

          <Nav className="me-end">
            <NotificationProvider value={NotificationValue}>
              <NotificationBell />
            </NotificationProvider>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const NotificationBell: React.FC = () => {
  const notify = useNotificationStore();
  return (
    <Nav.Link onClick={() => notify!.showAll()}>
      <span className="fa-layers fa-fw text-warning">
        <FontAwesomeIcon icon={'bell'} />
        {notify?.amount && <span className="fa-layers-counter">{notify?.amount}</span>}
      </span>
      <span className="d-lg-none">Alerta</span>
    </Nav.Link>
  );
};

export default Header;
