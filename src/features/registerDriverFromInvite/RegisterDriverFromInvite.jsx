import React, { useState, useEffect } from "react";
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
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // Show error if invite invalid
  if (verifyError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Invalid or expired invite link</Alert>
      </Container>
    );
  }
  if (verifySuccess) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h3 className="mb-0">Driver Registration</h3>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email (must match invite)</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Aadhaar Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="aadhar_number"
                      value={formData.aadhar_number}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>License Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Registering..." : "Register as Driver"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  return null; // fallback
};

export default RegisterDriver;
