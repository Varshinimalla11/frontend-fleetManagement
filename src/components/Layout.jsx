import React, { useState } from "react";
import { Container, Navbar as RBNavbar, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";

const Layout = () => {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const closeNav = () => setExpanded(false);

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: 20 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
