"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const InviteDriver = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "/api/invitetokens/send",
        { email: formData.email },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );

      setSuccess(`Invitation sent successfully to ${formData.email}`);
      setFormData({ email: "", name: "" });
      toast.success("Driver invitation sent!");
    } catch (error) {
      console.error("Error sending invitation:", error);
      setError(error.response?.data?.message || "Error sending invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header>
              <h3>Invite Driver</h3>
              <p className="text-muted mb-0">
                Send an invitation to a new driver to join your fleet
              </p>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Driver Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter driver's full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter driver's email address"
                  />
                  <Form.Text className="text-muted">
                    An invitation email will be sent to this address with
                    registration instructions.
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope me-2"></i>
                      Send Invitation
                    </>
                  )}
                </Button>
              </Form>

              <div className="mt-4 p-3 bg-light rounded">
                <h6>How it works:</h6>
                <ol className="mb-0 small">
                  <li>Enter the driver's name and email address</li>
                  <li>
                    An invitation email will be sent with a registration link
                  </li>
                  <li>The driver can use the link to create their account</li>
                  <li>
                    Once registered, they'll have access to the driver dashboard
                  </li>
                </ol>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InviteDriver;
