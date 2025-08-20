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
      <div className="text-center bg-dark bg-opacity-50 p-4 p-md-5 rounded-4 shadow-lg">
        <h1 className="text-white mb-4 fw-bold display-4">
          Truck Fleet Management
        </h1>
        <p className="text-white mb-4 fs-5 fw-light">
          "Safety. Efficiency. Excellence."
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            className="btn btn-outline-light btn-lg px-4 py-2 fw-semibold rounded-3 shadow-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-outline-light btn-lg px-4 py-2 fw-semibold rounded-3"
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
