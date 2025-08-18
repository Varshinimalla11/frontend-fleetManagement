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
import { toast } from "react-toastify";
import { useSendInviteMutation } from "../../api/inviteTokensApi";
import { useAuth } from "../../contexts/AuthContext";

const InviteDriver = () => {
  const { user } = useAuth(); // Get current user
  const [sendInvite, { isLoading }] = useSendInviteMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await sendInvite(formData).unwrap();
      toast.success(`Invite sent to ${formData.email}`);
      setFormData({ name: "", email: "" });
    } catch (err) {
      setError(err?.data?.message || "Error sending invite");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#9faaf4",
        minHeight: "100vh",
        width: "100%",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          padding: "2rem 3rem",
          boxSizing: "border-box",
          margin: "0 1rem",
        }}
      >
        <Col md={6}>
          <Card>
            <Card.Header>
              <h3>Invite New Driver</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="driverName">
                  <Form.Label>Driver Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter driver's full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="driverEmail">
                  <Form.Label>Driver Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter driver's email"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Invite"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </div>
    </div>
  );
};

export default InviteDriver;
