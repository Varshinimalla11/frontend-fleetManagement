"use client";

import {
  Navbar as BootstrapNavbar,
  Nav,
  NavDropdown,
  Container,
  Badge,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>
            <i className="fas fa-truck me-2"></i>
            Fleet Manager
          </BootstrapNavbar.Brand>
        </LinkContainer>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <LinkContainer to="/dashboard">
                  <Nav.Link>
                    <i className="fas fa-tachometer-alt me-1"></i>
                    Dashboard
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/trucks">
                  <Nav.Link>
                    <i className="fas fa-truck me-1"></i>
                    Trucks
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/trips">
                  <Nav.Link>
                    <i className="fas fa-route me-1"></i>
                    Trips
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/drive-sessions">
                  <Nav.Link>
                    <i className="fas fa-clock me-1"></i>
                    Drive Sessions
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/refuel-events">
                  <Nav.Link>
                    <i className="fas fa-gas-pump me-1"></i>
                    Refuel Events
                  </Nav.Link>
                </LinkContainer>

                {(user.role === "owner" || user.role === "admin") && (
                  <LinkContainer to="/invite-driver">
                    <Nav.Link>
                      <i className="fas fa-user-plus me-1"></i>
                      Invite Driver
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav>

              <Nav>
                <LinkContainer to="/notifications">
                  <Nav.Link className="position-relative">
                    <i className="fas fa-bell me-1"></i>
                    Notifications
                    {unreadCount > 0 && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle rounded-pill"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>

                <NavDropdown
                  title={
                    <>
                      <i className="fas fa-user me-1"></i>
                      {user.name}
                    </>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item disabled>
                    Role: {user.role}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link>Register</Nav.Link>
              </LinkContainer>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
