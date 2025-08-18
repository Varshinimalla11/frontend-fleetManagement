import React from "react";
import { useGetDriversQuery } from "../../api/authApi"; // your drivers API hook
import { Table, Container, Spinner } from "react-bootstrap";

const MyDrivers = () => {
  const { data: drivers = [], isLoading, isError } = useGetDriversQuery();

  if (isLoading) {
    return <Spinner animation="border" role="status" className="mt-3" />;
  }

  if (isError) {
    return <div className="text-danger mt-3">Failed to load drivers.</div>;
  }

  return (
    <Container className="mt-4">
      <h3>My Drivers</h3>
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
    </Container>
  );
};

export default MyDrivers;
