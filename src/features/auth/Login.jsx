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
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForgotPasswordMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImg from "../../assets/login.jpeg"; // Adjust path as necessary

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);

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
                <InputGroup>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1} // skip tab stop for accessibility
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
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
            <div className="text-center mt-3">
              <Button
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                style={{ padding: 0, textDecoration: "none" }}
              >
                Forgot Password?
              </Button>
            </div>
            <div className="text-center">
              New user? <Link to="/register">Register here</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                We'll send a password reset link to your email.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowForgotPassword(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleForgotPassword}
            disabled={forgotLoading}
          >
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;
