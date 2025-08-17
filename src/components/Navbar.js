"use client";

import React, { useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  NavDropdown,
  Container,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} from "../api/notificationsApi";
import moment from "moment";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  const {
    data: notifications = [],
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, { pollingInterval: 30000 });
  const [markAllRead, { isLoading: markingAll }] = useMarkAllNotificationsAsReadMutation();

  const unreadCount = notifications.filter((n) => !n.seen).length;

    const onNotificationsClick = (e) => {
    e.preventDefault();
    refetch();
    navigate("/notifications");
  };

  const handleLogout = () => {
    logout();
    navigate("/login")
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <i className="fas fa-truck me-2"></i> Fleet Manager
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              <i className="fas fa-tachometer-alt me-1"></i> Dashboard
            </Nav.Link>

            
            {(user?.role === "owner" || user?.role === "admin") && (
              <>
                <Nav.Link as={Link} to="/trucks">
                  <i className="fas fa-truck me-1"></i> Trucks
                </Nav.Link>
                <Nav.Link as={Link} to="/trips">
                  <i className="fas fa-route me-1"></i> Trips
                </Nav.Link>
                <Nav.Link as={Link} to="/invite-driver">
                  <i className="fas fa-user-plus me-1"></i> Invite Driver
                </Nav.Link>
              </>
            )}
           
              {user?.role === "driver" && (
              <Nav.Link as={Link} to="/my-trips">
                <i className="fas fa-road me-1"></i> My Trips
              </Nav.Link>
            )}
          </Nav>  
            <Nav>
            {user ? (
              <>
                {/* Notifications bell */}
                <Nav.Link
                  as={Link}
                  to="/notifications"
                  onClick={onNotificationsClick}
                 className="d-flex align-items-center position-relative"
                  style={{ padding: "0 1px", fontSize: "16px" }}
                  title="Notifications"
                >
                  <i className="fas fa-bell me-1"></i>
                  Notifications
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Nav.Link>
 
          <NavDropdown
                  title={
                    <>
                      <i className="fas fa-user me-1"></i> {user.name}
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
              </>
            ) : (
               <>
                <Nav.Link as={Link} to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="fas fa-user-plus me-1"></i> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
