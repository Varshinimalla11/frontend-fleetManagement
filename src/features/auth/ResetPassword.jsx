"use client";

// features/auth/ResetPassword.jsx - Create this new file
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useResetPasswordMutation,
  useValidateResetTokenQuery,
} from "../../api/authApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { data: tokenValidation, isLoading: validatingToken } =
    useValidateResetTokenQuery(token, {
      skip: !token,
    });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: formData.newPassword,
      }).unwrap();
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      setError(err?.data?.message || "Failed to reset password");
    }
  };

  if (validatingToken) {
    return (
      <div
        className="vh-100 d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="text-center text-white">
          <div
            className="spinner-border mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Validating token...</span>
          </div>
          <h4>Validating reset link...</h4>
        </div>
      </div>
    );
  }

  if (!tokenValidation?.valid) {
    return (
      <div
        className="vh-100 d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          className="card shadow-lg border-0 rounded-4 text-center"
          style={{
            maxWidth: "450px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="card-body p-5">
            <i className="fas fa-exclamation-triangle fa-4x text-danger mb-3"></i>
            <h4 className="text-danger mb-3">Invalid or Expired Link</h4>
            <p className="text-muted mb-4">
              The password reset link is invalid or has expired.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-3 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #007bff, #0056b3)",
              }}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{
          minWidth: "380px",
          maxWidth: "450px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="fas fa-key fa-4x text-warning mb-3"></i>
            <h3 className="fw-bold text-primary mb-2">Reset Password</h3>
            <p className="text-muted">Enter your new password below</p>
          </div>

          {error && (
            <div className="alert alert-danger rounded-3 border-0">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                <i className="fas fa-lock me-2 text-primary"></i>
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="rounded-3 py-3 border-0 shadow-sm"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid #ffc107",
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-dark">
                <i className="fas fa-lock me-2 text-primary"></i>
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="rounded-3 py-3 border-0 shadow-sm"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid #ffc107",
                }}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold rounded-3 border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #ffc107, #ff8c00)",
                color: "white",
                transition: "all 0.3s ease",
              }}
              disabled={isLoading}
              onMouseEnter={(e) =>
                !isLoading && (e.target.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Resetting Password...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle me-2"></i>
                  Reset Password
                </>
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-decoration-none fw-semibold text-primary"
            >
              <i className="fas fa-arrow-left me-1"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
