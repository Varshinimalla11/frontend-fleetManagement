import React from "react";
import { useGetDriversQuery } from "../../api/authApi"; // your drivers API hook
import { Table, Container, Spinner } from "react-bootstrap";

const MyDrivers = () => {
  const { data: drivers = [], isLoading, isError } = useGetDriversQuery();

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#9faaf4",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <Spinner animation="border" role="status" className="mt-3" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          backgroundColor: "#9faaf4",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          boxSizing: "border-box",
          color: "#721c24",
          fontWeight: "bold",
        }}
      >
        Failed to load drivers.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#9faaf4",
        minHeight: "100vh",
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
          borderRadius: 16,
          boxShadow: "0 2px 16px #0002",
          padding: "2rem",
          boxSizing: "border-box",
          margin: "0 auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <h3 className="mb-4 text-center">My Drivers</h3>

        {drivers.length === 0 ? (
          <p>No drivers assigned yet.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Aadhaar Number</th>
                <th>License Number</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver.name}</td>
                  <td>{driver.email}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.aadhar_number || "-"}</td>
                  <td>{driver.license_number || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MyDrivers;
