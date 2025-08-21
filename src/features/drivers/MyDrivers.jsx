"use client";
import { useGetDriversQuery } from "../../api/authApi"; // your drivers API hook
import { Table, Spinner } from "react-bootstrap";

const MyDrivers = () => {
  const { data: drivers = [], isLoading, isError } = useGetDriversQuery();

  if (isLoading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            role="status"
            style={{ width: "3rem", height: "3rem", color: "#fff" }}
          />
          <div className="mt-3 text-white h5">Loading drivers...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <div className="text-center text-white">
          <i
            className="fas fa-exclamation-triangle fa-3x mb-3"
            style={{ color: "#ff6b6b" }}
          ></i>
          <h4>Failed to load drivers</h4>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "94vh",
        width: "100%",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        paddingTop: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          padding: "2.5rem",
          boxSizing: "border-box",
          margin: "0 auto",
        }}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              color: "white",
            }}
          >
            <i className="fas fa-users fa-2x"></i>
          </div>
          <h3 className="mb-0" style={{ color: "#2c3e50", fontWeight: "600" }}>
            My Drivers
          </h3>
          <p className="text-muted mb-0">Manage your assigned drivers</p>
        </div>

        {drivers.length === 0 ? (
          /* Enhanced empty state with icon and better styling */
          <div className="text-center py-5">
            <i className="fas fa-user-plus fa-4x text-muted mb-3"></i>
            <h5 className="text-muted">No drivers assigned yet</h5>
            <p className="text-muted">
              Invite drivers to get started with your fleet management
            </p>
          </div>
        ) : (
          /* Enhanced table with better styling and hover effects */
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <th
                    style={{
                      border: "none",
                      padding: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    <i className="fas fa-user me-2"></i>Name
                  </th>
                  <th
                    style={{
                      border: "none",
                      padding: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    <i className="fas fa-envelope me-2"></i>Email
                  </th>
                  <th
                    style={{
                      border: "none",
                      padding: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    <i className="fas fa-phone me-2"></i>Phone
                  </th>
                  <th
                    style={{
                      border: "none",
                      padding: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    <i className="fas fa-id-card me-2"></i>Aadhaar
                  </th>
                  <th
                    style={{
                      border: "none",
                      padding: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    <i className="fas fa-id-badge me-2"></i>License
                  </th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => (
                  <tr
                    key={driver._id}
                    style={{
                      borderLeft: `4px solid ${
                        index % 2 === 0 ? "#667eea" : "#764ba2"
                      }`,
                      transition: "all 0.3s ease",
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: "1rem", fontWeight: "500" }}>
                      {driver.name}
                    </td>
                    <td style={{ padding: "1rem" }}>{driver.email}</td>
                    <td style={{ padding: "1rem" }}>{driver.phone}</td>
                    <td style={{ padding: "1rem" }}>
                      {driver.aadhar_number || "-"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {driver.license_number || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <style jsx>{`
        .table-row-hover:hover {
          background-color: #f8f9ff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
      `}</style>
    </div>
  );
};

export default MyDrivers;
