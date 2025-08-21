"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyOtpMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // Redirect if no email passed here
  if (!email) {
    navigate("/send-otp");
  }

  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success("OTP verified! Please complete registration.");
      navigate("/register", { state: { email } });
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
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
            <i className="fas fa-shield-alt fa-4x text-success mb-3"></i>
            <h2 className="fw-bold text-primary mb-2">Verify OTP</h2>
            <p className="text-muted">Enter the 6-digit code sent to:</p>
            <p className="fw-semibold text-primary">
              <i className="fas fa-envelope me-1"></i>
              {email}
            </p>
          </div>

          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label
                htmlFor="otpInput"
                className="form-label fw-semibold text-dark"
              >
                <i className="fas fa-key me-2 text-primary"></i>
                Verification Code
              </label>
              <input
                type="text"
                className="form-control rounded-3 py-3 border-0 shadow-sm text-center fs-4 fw-bold"
                id="otpInput"
                placeholder="000000"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid #28a745",
                  letterSpacing: "0.5rem",
                }}
                required
                disabled={isLoading}
              />
              <div className="form-text text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Enter the 6-digit code from your email
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 py-3 fw-semibold rounded-3 border-0 shadow-sm mb-3"
              style={{
                background: "linear-gradient(135deg, #28a745, #20c997)",
                color: "white",
                transition: "all 0.3s ease",
              }}
              disabled={isLoading || otp.length !== 6}
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
                  Verifying...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle me-2"></i>
                  Verify Code
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-muted small mb-2">Didn't receive the code?</p>
            <button
              className="btn btn-link text-decoration-none fw-semibold text-primary p-0"
              onClick={() => window.history.back()}
            >
              <i className="fas fa-arrow-left me-1"></i>
              Go Back & Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
