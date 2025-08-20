import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForgotPasswordMutation } from "../../api/authApi";
import { toast } from "react-toastify";

import loginImg from "../../assets/login.jpeg"; // Adjust path as necessary

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPassword] = useForgotPasswordMutation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await login(formData).unwrap();

      // ✅ Check if login was actually successful
      if (response && response.token) {
        toast.success("✅ Login successful");
        navigate(from, { replace: true });
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error("Login error details:", err);

      const errorMessage = err?.data?.message || "Invalid credentials";
      setError(errorMessage);
      toast.error(errorMessage);

      // ✅ Check for specific error types before reloading
      const shouldReload =
        err?.status === 400 || // Bad request
        err?.status === 401 || // Unauthorized
        err?.data?.message?.includes("Invalid") || // Invalid credentials message
        err?.data?.message?.includes("invalid"); // Invalid credentials message

      if (shouldReload) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setForgotLoading(true);
      await forgotPassword({ email: forgotEmail }).unwrap();
      toast.success("If the email exists, a reset link has been sent");
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send reset email");
    } finally {
      setForgotLoading(false);
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
          <h1
            className="fw-bold mb-3 display-4"
            style={{ textShadow: "0 2px 8px #000" }}
          >
            Welcome Back
          </h1>
          <p className="fs-5 fw-light" style={{ textShadow: "0 2px 6px #000" }}>
            Enter your details to access your account.
          </p>
        </div>
      </Col>

      {/* Right half: Login form */}
      <Col
        md={6}
        className="bg-primary bg-opacity-25 d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card
          className="shadow-lg border-0 rounded-4"
          style={{ minWidth: "340px", maxWidth: "380px", width: "100%" }}
        >
          <Card.Body className="p-4">
            <h3 className="mb-4 text-center fw-bold text-primary">Login</h3>
            {error && (
              <Alert variant="danger" className="rounded-3">
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="fw-semibold text-muted">
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="rounded-3 py-2"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label className="fw-semibold text-muted">
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="rounded-3 py-2"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 py-2 fw-semibold rounded-3 shadow-sm"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>
            <div className="text-center mt-3">
              <Button
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                className="text-decoration-none fw-semibold"
              >
                Forgot Password?
              </Button>
            </div>
            <div className="text-center">
              <span className="text-muted">New user? </span>
              <Link to="/register" className="text-decoration-none fw-semibold">
                Register here
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-muted">
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="rounded-3 py-2"
                required
              />
              <Form.Text className="text-muted">
                We'll send a password reset link to your email.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowForgotPassword(false)}
            className="rounded-3 px-4"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleForgotPassword}
            disabled={forgotLoading}
            className="rounded-3 px-4 fw-semibold"
          >
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;
