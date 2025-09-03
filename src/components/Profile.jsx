import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from "../api/authApi";
import { toast } from "react-toastify";

const Profile = () => {
  const { data: user, isLoading, error } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadhar_number: "",
    license_number: "",
  });

  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        aadhar_number: user.aadhar_number || "",
        license_number: user.license_number || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((fd) => ({ ...fd, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    // Prepare data to send, exclude driver fields if role is owner
    let updateData = {
      name: formData.name,
      phone: formData.phone,
    };
    if (user.role === "driver") {
      updateData = {
        ...updateData,
        aadhar_number: formData.aadhar_number,
        license_number: formData.license_number,
      };
    }

    try {
      await updateProfile(updateData).unwrap();

      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  if (isLoading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div>Loading profile...</div>
      </div>
    );
  if (error) return <Alert variant="danger">Failed to load profile.</Alert>;

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #9faaf4, #5CB8E4 75%)",
        minHeight: "94vh",
        width: "100vw",
        boxSizing: "border-box",
        padding: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        className="shadow"
        style={{
          maxWidth: "480px",
          width: "100%",
          borderRadius: "18px",
          paddingBottom: "0.5rem",
        }}
      >
        <Card.Header
          style={{
            background: "linear-gradient(90deg, #865DFF, #5CB8E4 90%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.35rem",
            padding: "0.8rem 1.9rem",
            borderTopLeftRadius: "18px",
            borderTopRightRadius: "18px",
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <span
            style={{
              background: "#6e63ff",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: "1.2rem",
            }}
          >
            <i className="fa fa-user"></i>
          </span>
          My Profile
        </Card.Header>
        <Card.Body
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "0 0 18px 18px",
            padding: "2rem 1.9rem 1.4rem 1.9rem",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email </Form.Label>
              <Form.Control type="email" value={user.email} readOnly disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role </Form.Label>
              <Form.Control type="text" value={user.role} readOnly disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {user.role === "driver" && (
              <>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="aadhar_number">
                      <Form.Label>Aadhar Number</Form.Label>
                      <Form.Control
                        name="aadhar_number"
                        type="text"
                        value={formData.aadhar_number}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="license_number">
                      <Form.Label>License Number</Form.Label>
                      <Form.Control
                        name="license_number"
                        type="text"
                        value={formData.license_number}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="owner_name">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.ownedBy?.name || "N/A"}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </>
            )}
            <div className="d-flex justify-content-center mt-2">
              <Button
                type="submit"
                disabled={isUpdating}
                variant="primary"
                style={{
                  minWidth: "170px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  background:
                    "linear-gradient(90deg, #865DFF 80%, #5CB8E4 100%)",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
