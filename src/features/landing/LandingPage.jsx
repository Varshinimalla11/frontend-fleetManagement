import React from "react";
import { useNavigate } from "react-router-dom";
import landing from "../../assets/landing.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: `url(${landing}) center center / cover no-repeat`,
        position: "relative",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <div
        className="text-center"
        style={{
          background: "rgba(0,0,0,0.3)", // optional: translucent panel for readability
          padding: "2rem 2.5rem",
          borderRadius: 15,
        }}
      >
        <h1
          className="text-white mb-4"
          style={{
            fontWeight: 700,
            fontSize: "2.5rem",
            textShadow: "0 2px 12px #000",
          }}
        >
          Truck Fleet Management
        </h1>
        <p
          className="text-white mb-4"
          style={{ fontSize: "1.25rem", textShadow: "0 2px 8px #000a" }}
        >
          "Safety. Efficiency. Excellence."
        </p>
        <div>
          <button
            className="btn btn-light mx-2 px-4"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-light mx-2 px-4"
            onClick={() => navigate("/send-otp")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
