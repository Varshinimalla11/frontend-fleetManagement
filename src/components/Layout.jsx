import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container fluid style={{ padding: "0px" }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
