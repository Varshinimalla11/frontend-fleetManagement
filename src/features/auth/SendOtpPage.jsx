"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendOtpMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import "font-awesome/css/font-awesome.min.css";

const SendOtpPage = () => {
  const [email, setEmail] = useState("");
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtp({ email }).unwrap();
      toast.success("OTP sent to your email!");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
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
            <i className="fas fa-mobile-alt fa-4x text-primary mb-3"></i>
            <h2 className="fw-bold text-primary mb-2">Verify Your Email</h2>
            <p className="text-muted">
              We'll send a verification code to your email address
            </p>
          </div>

          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label
                htmlFor="emailInput"
                className="form-label fw-semibold text-dark"
              >
                <i className="fas fa-envelope me-2 text-primary"></i>
                Email Address
              </label>
              <input
                type="email"
                className="form-control rounded-3 py-3 border-0 shadow-sm"
                id="emailInput"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid #007bff",
                }}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-3 fw-semibold rounded-3 border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #28a745, #20c997)",
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
                    aria-hidden="true"
                  ></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Verification Code
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted small">
              <i className="fas fa-info-circle me-1"></i>
              Check your spam folder if you don't receive the code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendOtpPage;
