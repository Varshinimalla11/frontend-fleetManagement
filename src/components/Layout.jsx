// src/components/Layout.jsx
import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="App">
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">
            Fleet Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
              {user?.role === "owner" && (
                <Nav.Link as={Link} to="/invite-driver">
                  Invite Driver
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
                {user?.name} ({user?.role})
              </Navbar.Text>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {/* All page components will render here */}
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;
