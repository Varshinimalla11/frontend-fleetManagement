"use client";

import { useState } from "react";
import { Row, Col, Card, Form, Button, Alert, Modal } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForgotPasswordMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import truck from "../../assets/truck.jpg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPassword] = useForgotPasswordMutation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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

      if (response && response.token) {
        toast.success("✅ Login successful");
        navigate(from, { replace: true });
      } else {
        toast.error("Login failed, please try again");
      }
    } catch (err) {
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

      const shouldReload =
        err?.status === 400 ||
        err?.status === 401 ||
        (err?.data?.message && err?.data?.message?.includes("invalid"));

      if (shouldReload) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

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
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: "#e9f4fb",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "100vh",
          position: "relative",
          backgroundImage: `url(${truck})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        {/* Dark overlay for text contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            //backgroundColor: "rgba(2, 100, 182, 0.75)", // semi-transparent blue overlay
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            zIndex: 1,
          }}
        />
        {/* Content layered above overlay */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: 440,
            margin: "0 auto",
          }}
        >
          <h1 style={{ fontWeight: 800, fontSize: 44, marginBottom: 20 }}>
            Welcome to FleetFlow
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.5 }}>
            The smart way to manage your fleet and drivers.
            <br />
            Boost productivity and streamline every operation.
          </p>
        </div>
      </div>
      {/* Right side - Login form */}
      {/* <div
        style={{
          width: "50%",
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 32px",
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h2 style={{ fontWeight: 600, fontSize: 24, marginBottom: 20 }}>
            Login to Your Account
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
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

            <Form.Group className="mb-3">
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

            <div className="mb-3 text-end">
              <Button
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                style={{ textDecoration: "none" }}
              >
                Forgot password?
              </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button
              type="submit"
              variant="primary"
              style={{ width: "100%", fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            Don&apos;t have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div> */}
      <Col
        md={6}
        className="d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #8c9ff3ff 0%, white 100%)",
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

              <Form.Group
                className="mb-4 position-relative"
                controlId="formPassword"
              >
                <Form.Label className="fw-semibold text-dark">
                  <i className="fas fa-lock me-2 text-primary"></i>
                  Password
                </Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="rounded-3 py-3 border-0 shadow-sm"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderLeft: "4px solid #007bff",
                      paddingRight: "40px",
                    }}
                    required
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#007bff",
                      fontSize: "1.2rem",
                    }}
                  >
                    <i
                      className={
                        showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                      }
                    ></i>
                  </span>
                </div>
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
      {/* Forgot Password Modal */}
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
            <i className="fas fa-key me-2"></i> Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-3">
            <i className="fas fa-envelope-open fa-3x text-primary mb-3"></i>
            <p className="text-muted">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                <i className="fas fa-envelope me-2 text-primary"></i> Email
                Address
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
            <i className="fas fa-times me-1"></i> Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            disabled={forgotLoading}
            className="rounded-3 px-4 fw-semibold border-0"
            style={{
              background: "linear-gradient(135deg, #007bff, #0056b3)",
            }}
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
                <i className="fas fa-paper-plane me-1"></i> Send Reset Link
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
