"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  NavDropdown,
  Container,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} from "../api/notificationsApi";
import moment from "moment";
import { useGetDriversQuery } from "../api/authApi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 'expanded' controls if navbar menu is open or closed
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null);

  const handleToggle = () => setExpanded((prev) => !prev);
  const closeNavbar = () => setExpanded(false);

  const { data: notifications = [], refetch: refetchNotifications } =
    useGetNotificationsQuery(undefined, { pollingInterval: 30000 });

  const { data: drivers = [], isLoading: loadingDrivers } =
    useGetDriversQuery();

  const [markAllRead, { isLoading: markingAll }] =
    useMarkAllNotificationsAsReadMutation();

  const unreadCount = notifications.filter((n) => !n.seen).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        expanded &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  const onNotificationsClick = (e) => {
    e.preventDefault();
    refetchNotifications();
    navigate("/notifications");
    closeNavbar();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
 return (
    <BootstrapNavbar
      className="shadow-sm"
      style={{
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        borderBottom: "3px solid #0d6efd",
      }}
      variant="dark"
      expand="lg"
      sticky="top"
      expanded={expanded}
      ref={navRef}
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4 text-white"
          style={{
            textDecoration: "none",
            transition: "all 0.3s ease",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          <i className="fas fa-truck me-2 text-warning"></i>
          Fleet Manager
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle}
          className="border-0"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
        />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" onClick={closeNavbar}>
            {(user?.role === "owner" || user?.role === "admin") && (
              <>
                <Nav.Link
                  as={Link}
                  to="/trucks"
                  className="mx-1 px-3 py-2 rounded-pill text-white fw-medium"
                  style={{
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  <i className="fas fa-truck me-2 text-info"></i> Trucks
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/trips"
                  className="mx-1 px-3 py-2 rounded-pill text-white fw-medium"
                  style={{
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  <i className="fas fa-route me-2 text-success"></i> Trips
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/invite-driver"
                  className="mx-1 px-3 py-2 rounded-pill text-white fw-medium"
                  style={{
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  <i className="fas fa-user-plus me-2 text-warning"></i> Invite Driver
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/my-drivers"
                  className="mx-1 px-3 py-2 rounded-pill text-white fw-medium"
                  style={{
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  <i className="fas fa-users me-2 text-primary"></i> My Drivers
                </Nav.Link>
              </>
            )}

            {user?.role === "driver" && (
              <Nav.Link
                as={Link}
                to="/my-trips"
                className="mx-1 px-3 py-2 rounded-pill text-white fw-medium"
                style={{
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                  e.target.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent"
                  e.target.style.transform = "translateY(0)"
                }}
              >
                <i className="fas fa-road me-2 text-success"></i> My Trips
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/notifications"
                  onClick={(e) => {
                    onNotificationsClick(e)
                    closeNavbar()
                  }}
                  className="d-flex align-items-center position-relative mx-2 px-3 py-2 rounded-pill text-white fw-medium"
                  style={{
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  title="Notifications"
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  <i className="fas fa-bell me-2 text-warning"></i>
                  Notifications
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute"
                      style={{
                        fontSize: "0.7rem",
                        top: "8px",
                        right: "8px",
                        minWidth: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Nav.Link>

                <NavDropdown
                  title={
                    <span className="text-white fw-medium">
                      <i className="fas fa-user me-2 text-info"></i> {user.name}
                    </span>
                  }
                  id="user-dropdown"
                  className="mx-1"
                  style={{
                    "--bs-dropdown-link-hover-bg": "#0d6efd",
                    "--bs-dropdown-border-radius": "10px",
                  }}
                >
                  <NavDropdown.Item disabled className="fw-bold text-muted" style={{ backgroundColor: "#f8f9fa" }}>
                    <i className="fas fa-id-badge me-2"></i>
                    Role: <span className="text-primary">{user.role}</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      handleLogout()
                      closeNavbar()
                    }}
                    className="text-danger fw-medium"
                    style={{
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#fff5f5")}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={closeNavbar}
                  className="mx-1 px-3 py-2 rounded-pill text-white fw-medium"
                  style={{
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  <i className="fas fa-sign-in-alt me-2 text-success"></i> Login
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/register"
                  onClick={closeNavbar}
                  className="mx-1 px-3 py-2 rounded-pill text-white fw-medium"
                  style={{
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.15)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  <i className="fas fa-user-plus me-2 text-info"></i> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar;
