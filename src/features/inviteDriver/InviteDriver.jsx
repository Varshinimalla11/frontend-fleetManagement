"use client";

import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSendInviteMutation } from "../../api/inviteTokensApi";
import { useAuth } from "../../contexts/AuthContext";
import { FaUserPlus, FaUser, FaEnvelope, FaPaperPlane } from "react-icons/fa";

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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        height: "94vh",
        width: "100%",
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 600,
          minHeight: "50vh",
          border: "none",
          borderRadius: 20,
          boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card.Header
          className="text-white text-center py-4"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div className="d-flex align-items-center justify-content-center mb-2">
            <div
              className="d-inline-flex align-items-center justify-content-center me-3"
              style={{
                width: "50px",
                height: "50px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                backdropFilter: "blur(10px)",
              }}
            >
              <FaUserPlus size={24} />
            </div>
            <div>
              <h3 className="mb-0" style={{ fontWeight: "600" }}>
                Invite New Driver
              </h3>
              <small style={{ opacity: 0.9 }}>
                Send an invitation to join your fleet
              </small>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-5">
          {error && (
            /* Enhanced error alert with icon */
            <Alert variant="danger" className="d-flex align-items-center mb-4">
              <FaUserPlus size={24} className="me-2" />
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="driverName">
              <Form.Label className="fw-semibold text-dark">
                <FaUser size={16} className="me-2 text-primary" />
                Driver Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter driver's full name"
                required
                style={{
                  borderLeft: "4px solid #667eea",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                }}
                className="form-control-enhanced"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="driverEmail">
              <Form.Label className="fw-semibold text-dark">
                <FaEnvelope size={16} className="me-2 text-success" />
                Driver Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter driver's email address"
                required
                style={{
                  borderLeft: "4px solid #28a745",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                }}
                className="form-control-enhanced"
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold"
              disabled={isLoading}
              style={{
                background: isLoading
                  ? "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "25px",
                fontSize: "1.1rem",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
                transform: isLoading ? "none" : "translateY(0)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 12px 35px rgba(102, 126, 234, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(102, 126, 234, 0.3)";
                }
              }}
            >
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></div>
                  Sending Invitation...
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <FaPaperPlane size={16} className="me-2" />
                  Send Invite
                </div>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <style jsx>{`
        .form-control-enhanced:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          border-color: #667eea !important;
        }
        .form-control-enhanced:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default InviteDriver;
