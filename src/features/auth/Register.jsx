"use client";

import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import loginImg from "../../assets/login.jpeg";
import "font-awesome/css/font-awesome.min.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate("/send-otp");
  }

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...apiData } = formData;
      await register({ ...apiData, email });
      toast.success("✅ Registration successful. Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      if (err?.status === 409) {
        setError(err.data.message); // duplicate email/phone friendly message
        toast.error(
          err.data.message || "Registration failed. Please try again."
        );
      } else {
        setError(
          err?.data?.message || "Registration failed. Please try again."
        );
        toast.error(
          err?.data?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row style={{ minHeight: "100vh" }}>
        {/* Left Side: Image and Welcome Text */}
        <Col
          md={6}
          className="d-none d-md-flex flex-column justify-content-center align-items-center"
          style={{
            background: `linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(32, 201, 151, 0.9)), url(${loginImg}) center/cover no-repeat`,
          }}
        >
          <div style={{ textAlign: "center", color: "white" }}>
            <div className="mb-4">
              <i
                className="fas fa-user-plus fa-4x mb-3"
                style={{ opacity: 0.9 }}
              ></i>
            </div>
            <h2
              className="fw-bold mb-3 display-5"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              Join Our Fleet
            </h2>
            <p
              className="fs-5 fw-light"
              style={{ textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
            >
              Create your account to start managing your fleet efficiently.
            </p>
          </div>
        </Col>

        {/* Right Side: Register Form */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
          style={{
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 450,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
            className="shadow-lg border-0 rounded-4"
          >
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="fas fa-user-circle fa-3x text-success mb-3"></i>
                <h3 className="fw-bold text-success">Create Account</h3>
                <p className="text-muted">
                  Fill in your details to get started
                </p>
              </div>

              {error && (
                <div className="alert alert-danger rounded-3 border-0">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-user me-2 text-success"></i>
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="rounded-3 py-3 border-0 shadow-sm"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderLeft: "4px solid #28a745",
                    }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-envelope me-2 text-success"></i>
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    disabled
                    className="rounded-3 py-3 border-0 shadow-sm"
                    style={{
                      backgroundColor: "#e9ecef",
                      borderLeft: "4px solid #6c757d",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-lock me-2 text-success"></i>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    className="rounded-3 py-3 border-0 shadow-sm"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderLeft: "4px solid #28a745",
                    }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-lock me-2 text-success"></i>
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="rounded-3 py-3 border-0 shadow-sm"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderLeft: "4px solid #28a745",
                    }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPhone">
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-phone me-2 text-success"></i>
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="rounded-3 py-3 border-0 shadow-sm"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderLeft: "4px solid #28a745",
                    }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-100 py-3 fw-semibold rounded-3 border-0 shadow-sm mb-3"
                  style={{
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    !loading && (e.target.style.transform = "translateY(-2px)")
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </Button>
              </Form>

              <hr className="my-3" />

              <div className="text-center">
                <span className="text-muted">Already have an account? </span>
                <Link
                  to="/login"
                  className="text-decoration-none fw-semibold text-success"
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Sign In Here
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Register;
