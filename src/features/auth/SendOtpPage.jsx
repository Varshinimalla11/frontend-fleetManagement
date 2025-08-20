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
    <form onSubmit={handleSendOtp}>
      <h2>Send OTP</h2>
      <input
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};

export default SendOtpPage;
