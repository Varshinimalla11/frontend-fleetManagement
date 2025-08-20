import React, { useState } from "react";
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
import loginImg from "../../assets/login.jpeg";

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
          style={{ background: `url(${loginImg}) center/cover no-repeat` }}
        >
          <h2 className="text-white mb-2">Welcome!</h2>
          <p className="text-white">Create your account to get started.</p>
        </Col>
        {/* Right Side: Register Form */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#8592e6" }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: "white",
            }}
            className="p-4 shadow"
          >
            <Card.Body>
              <h3 className="mb-3 text-center">Register</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    disabled
                    // placeholder="Enter email"
                    // required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </Form>
              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Register;
