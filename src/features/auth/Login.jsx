import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import loginImg from "../../assets/login.jpeg"; // Adjust path as necessary

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(formData);
      toast.success("✅ Login successful");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-stretch p-0"
      style={{ overflow: "hidden" }}
    >
      {/* Left half: Welcome image and text */}
      <Col
        md={6}
        className="d-none d-md-flex flex-column justify-content-center align-items-center"
        style={{
          background: `url(${loginImg}) center center/cover no-repeat`,
          color: "#fff",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            background: "rgba(0,0,0,0.35)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 className="fw-bold mb-3" style={{ textShadow: "0 2px 8px #000" }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: "1.3rem", textShadow: "0 2px 6px #000" }}>
            Enter your details to access your account.
          </p>
        </div>
      </Col>

      {/* Right half: Login form */}
      <Col
        md={6}
        style={{
          backgroundColor: "#9faaf4ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          style={{
            minWidth: 340,
            maxWidth: 380,
            width: "100%",
            boxShadow: "0 2px 32px #0001",
          }}
        >
          <Card.Body>
            <h3 className="mb-4 text-center">Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>

            <div className="text-center">
              New user? <Link to="/register">Register here</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default Login;
