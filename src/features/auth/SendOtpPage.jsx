import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendOtpMutation } from "../../api/authApi";
import { toast } from "react-toastify";

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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Send OTP</h2>
        <form onSubmit={handleSendOtp}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
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
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendOtpPage;
