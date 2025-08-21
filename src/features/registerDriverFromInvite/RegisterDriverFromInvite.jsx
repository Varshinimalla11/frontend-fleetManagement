"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRegisterDriverFromInviteMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import { useVerifyInviteTokenMutation } from "../../api/inviteTokensApi";

const RegisterDriver = () => {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

  const navigate = useNavigate();
  const [registerDriver, { isLoading: isRegistering }] =
    useRegisterDriverFromInviteMutation();
  const [
    verifyInviteToken,
    {
      data: verifyData,
      isLoading: isVerifying,
      isError: verifyError,
      isSuccess: verifySuccess,
    },
  ] = useVerifyInviteTokenMutation();
  // const [verifying, setVerifying] = useState(true);
  // const [invalidInvite, setInvalidInvite] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    aadhar_number: "",
    license_number: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (inviteToken) {
      verifyInviteToken({ token: inviteToken });
    }
  }, [inviteToken, verifyInviteToken]);

  useEffect(() => {
    if (verifyData?.email) {
      setFormData((prev) => ({ ...prev, email: verifyData.email }));
    }
  }, [verifyData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        token: inviteToken,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        aadhar_number: formData.aadhar_number,
        license_number: formData.license_number,
      };

      await registerDriver(payload).unwrap();

      toast.success("✅ Driver registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err?.data?.message || "Error registering driver");
    }
  };

  // Show spinner while verifying
  if (isVerifying) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="light" size="lg" />
          <div className="mt-3 text-white">
            <i className="fas fa-shield-alt me-2"></i>
            Verifying invitation...
          </div>
        </div>
      </div>
    );
  }

  // Show error if invite invalid
  if (verifyError) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          paddingTop: "5rem",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Alert variant="danger" className="text-center shadow-lg">
                <i className="fas fa-exclamation-triangle fa-2x mb-3 text-danger"></i>
                <h4>Invalid Invitation</h4>
                <p className="mb-0">
                  This invite link is invalid or has expired. Please contact
                  your administrator for a new invitation.
                </p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (verifySuccess) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} xl={6}>
              <Card
                className="shadow-lg border-0"
                style={{ borderRadius: "15px" }}
              >
                <Card.Header
                  className="text-white text-center py-4 border-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                    borderRadius: "15px 15px 0 0",
                  }}
                >
                  <i className="fas fa-user-plus fa-2x mb-2"></i>
                  <h3 className="mb-0 fw-bold">Driver Registration</h3>
                  <small className="opacity-75">
                    Complete your profile to get started
                  </small>
                </Card.Header>
                <Card.Body className="p-4">
                  {error && (
                    <Alert
                      variant="danger"
                      className="d-flex align-items-center mb-4"
                    >
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <i className="fas fa-user me-2 text-primary"></i>
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-control-lg"
                            style={{ borderLeft: "4px solid #007bff" }}
                            placeholder="Enter your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <i className="fas fa-envelope me-2 text-success"></i>
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled
                            className="form-control-lg bg-light"
                            style={{ borderLeft: "4px solid #28a745" }}
                          />
                          <Form.Text className="text-muted">
                            <i className="fas fa-lock me-1"></i>
                            This email is pre-filled from your invitation
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <i className="fas fa-phone me-2 text-info"></i>
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control-lg"
                            style={{ borderLeft: "4px solid #17a2b8" }}
                            placeholder="Enter your phone number"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <i className="fas fa-id-card me-2 text-warning"></i>
                            Aadhaar Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="aadhar_number"
                            value={formData.aadhar_number}
                            onChange={handleChange}
                            required
                            className="form-control-lg"
                            style={{ borderLeft: "4px solid #ffc107" }}
                            placeholder="Enter 12-digit Aadhaar number"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">
                        <i className="fas fa-id-badge me-2 text-secondary"></i>
                        Driving License Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                        required
                        className="form-control-lg"
                        style={{ borderLeft: "4px solid #6c757d" }}
                        placeholder="Enter your driving license number"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold text-dark">
                            <i className="fas fa-lock me-2 text-danger"></i>
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-control-lg"
                            style={{ borderLeft: "4px solid #dc3545" }}
                            placeholder="Create a strong password"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold text-dark">
                            <i className="fas fa-lock me-2 text-danger"></i>
                            Confirm Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-control-lg"
                            style={{ borderLeft: "4px solid #dc3545" }}
                            placeholder="Confirm your password"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      className="w-100 py-3 fw-bold text-uppercase"
                      disabled={isRegistering}
                      style={{
                        background: isRegistering
                          ? "linear-gradient(135deg, #6c757d 0%, #5a6268 100%)"
                          : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isRegistering ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Registering Driver...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-check me-2"></i>
                          Register as Driver
                        </>
                      )}
                    </Button>
                  </Form>

                  <div className="text-center mt-4 pt-3 border-top">
                    <small className="text-muted">
                      <i className="fas fa-shield-alt me-1"></i>
                      Your information is secure and will only be used for fleet
                      management purposes
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
  return null; // fallback
};

export default RegisterDriver;
