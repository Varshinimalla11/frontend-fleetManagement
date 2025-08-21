"use client";

import { useState } from "react";
import {
  Container,
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
        toast.error("Login failed, please try again");
      }
    } catch (err) {
      console.error("Login error details:", err);

      let errorMessage = "Credentials entered are incorrect";
      if (err?.data?.message && typeof err.data.message === "string") {
        errorMessage = err.data.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message && typeof err.message === "string") {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);

      // ✅ Check for specific error types before reloading
      const shouldReload =
        err?.status === 400 || // Bad request
        err?.status === 401 || // Unauthorized
        (err?.data?.message && // Invalid credentials message
          err?.data?.message?.includes("invalid")); // Invalid credentials message

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
          background: `linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(155, 89, 182, 0.9)), url(${loginImg}) center center/cover no-repeat`,
          color: "#fff",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="mb-4">
            <i className="fas fa-truck fa-4x mb-3" style={{ opacity: 0.9 }}></i>
          </div>
          <h1
            className="fw-bold mb-3 display-4"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            Welcome Back
          </h1>
          <p
            className="fs-5 fw-light"
            style={{ textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
          >
            Enter your details to access your fleet management dashboard.
          </p>
        </div>
      </Col>

      {/* Right half: Login form */}
      <Col
        md={6}
        className="d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        <Card
          className="shadow-lg border-0 rounded-4"
          style={{
            minWidth: "340px",
            maxWidth: "420px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
              <h3 className="fw-bold text-primary">Sign In</h3>
              <p className="text-muted">Access your account</p>
            </div>

            {error && (
              <Alert variant="danger" className="rounded-3 border-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="fw-semibold text-dark">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="rounded-3 py-3 border-0 shadow-sm"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderLeft: "4px solid #007bff",
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label className="fw-semibold text-dark">
                  <i className="fas fa-lock me-2 text-primary"></i>
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="rounded-3 py-3 border-0 shadow-sm"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderLeft: "4px solid #007bff",
                  }}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 py-3 fw-semibold rounded-3 border-0 shadow-sm mb-3"
                style={{
                  background: "linear-gradient(135deg, #007bff, #0056b3)",
                  transition: "all 0.3s ease",
                }}
                disabled={loading}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "translateY(0)")
                }
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </>
                )}
              </Button>
            </Form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                className="text-decoration-none fw-semibold text-primary p-0 mb-3"
              >
                <i className="fas fa-key me-1"></i>
                Forgot Password?
              </Button>
            </div>

            <hr className="my-3" />

            <div className="text-center">
              <span className="text-muted">New to our platform? </span>
              <Link
                to="/send-otp"
                className="text-decoration-none fw-semibold text-primary"
              >
                <i className="fas fa-user-plus me-1"></i>
                Create Account
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Enhanced Forgot Password Modal */}
      <Modal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          className="border-0 pb-0"
          style={{ background: "linear-gradient(135deg, #007bff, #0056b3)" }}
        >
          <Modal.Title className="fw-bold text-white">
            <i className="fas fa-key me-2"></i>
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-3">
            <i className="fas fa-envelope-open fa-3x text-primary mb-3"></i>
            <p className="text-muted">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                <i className="fas fa-envelope me-2 text-primary"></i>
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="rounded-3 py-3 border-0 shadow-sm"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid #007bff",
                }}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowForgotPassword(false)}
            className="rounded-3 px-4 fw-semibold"
          >
            <i className="fas fa-times me-1"></i>
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            disabled={forgotLoading}
            className="rounded-3 px-4 fw-semibold border-0"
            style={{ background: "linear-gradient(135deg, #007bff, #0056b3)" }}
          >
            {forgotLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-1"></i>
                Send Reset Link
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;
