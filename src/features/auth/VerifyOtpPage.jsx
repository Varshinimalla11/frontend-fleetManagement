import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyOtpMutation } from "../../api/authApi";
import { toast } from "react-toastify";

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
    <form onSubmit={handleVerifyOtp}>
      <h2>Verify OTP</h2>
      <p>Email: {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        maxLength={6}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};

export default VerifyOtpPage;
