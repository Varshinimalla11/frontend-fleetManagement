// src/components/TruckList.jsx
import React from "react";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetTrucksQuery, useDeleteTruckMutation } from "../../api/trucksApi";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const TruckList = () => {
  const { user } = useAuth();
  const { data: trucks, error, isLoading } = useGetTrucksQuery();
  const [deleteTruck] = useDeleteTruckMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this truck?")) {
      try {
        await deleteTruck(id).unwrap();
        toast.success("Truck deleted successfully");
      } catch (err) {
        toast.error("Failed to delete truck");
      }
    }
  };

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <div>Error loading trucks</div>;

  return (
    <Container className="mt-4">
      <h1>Trucks</h1>
      {(user?.role === "owner" || user?.role === "admin") && (
        <Button as={Link} to="/trucks/new" className="mb-3" variant="primary">
          Add New Truck
        </Button>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Condition</th>
            <th>Mileage Factor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trucks?.map((truck) => (
            <tr key={truck._id}>
              <td>
                <Link to={`/trucks/${truck._id}`}>{truck.plate_number}</Link>
              </td>
              <td>{truck.condition}</td>
              <td>{truck.mileage_factor}</td>
              <td>
                <Button
                  as={Link}
                  to={`/trucks/${truck._id}`}
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  title="View Truck"
                >
                  <i className="fas fa-eye"></i>
                </Button>

                <Button
                  as={Link}
                  to={`/trucks/${truck._id}/edit`}
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  title="Edit Truck"
                >
                  <i className="fas fa-edit"></i>
                </Button>

                {(user?.role === "owner" || user?.role === "admin") && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    title="Delete Truck"
                    onClick={() => handleDelete(truck._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TruckList;
