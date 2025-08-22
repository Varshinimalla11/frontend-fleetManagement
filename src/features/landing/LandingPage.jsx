"use client";
import { useNavigate } from "react-router-dom";
import landing from "../../assets/landing.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${landing}) center center / cover no-repeat`,
        position: "relative",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <div
        className="text-center p-4 p-md-5 rounded-4 shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <h1
          className="text-white mb-4 fw-bold display-4"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            letterSpacing: "1px",
          }}
        >
          <i className="fas fa-truck me-3" style={{ color: "#4CAF50" }}></i>
          Fleet Flow
        </h1>
        <p
          className="text-white mb-4 fs-5 fw-light"
          style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            fontStyle: "italic",
          }}
        >
          <i
            className="fas fa-shield-alt me-2"
            style={{ color: "#2196F3" }}
          ></i>
          "Safety. Efficiency. Excellence."
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            className="btn btn-lg px-5 py-3 fw-semibold rounded-3 shadow-lg position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              border: "none",
              color: "white",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(76, 175, 80, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
            }}
            onClick={() => navigate("/login")}
          >
            <i className="fas fa-sign-in-alt me-2"></i>
            Login
          </button>
          <button
            className="btn btn-lg px-5 py-3 fw-semibold rounded-3 shadow-lg position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2196F3, #1976D2)",
              border: "none",
              color: "white",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(33, 150, 243, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
            }}
            onClick={() => navigate("/send-otp")}
          >
            <i className="fas fa-user-plus me-2"></i>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
