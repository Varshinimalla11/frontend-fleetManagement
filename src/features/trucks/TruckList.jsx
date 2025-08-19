// src/components/TruckList.jsx
import React from "react";
import { Table, Button, Container, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useGetTrucksQuery, useDeleteTruckMutation } from "../../api/trucksApi";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";

const TruckList = () => {
  const { user } = useAuth();
  const { data: trucks, error, isLoading } = useGetTrucksQuery();
  const [deleteTruck, { isLoading: isDeleting }] = useDeleteTruckMutation();
  const navigate = useNavigate();
  const { refetch } = useGetDashboardStatsQuery(undefined, { skip: false });

  const conditionColors = {
    active: "success",
    maintenance_needed: "warning",
    in_maintenance: "danger",
    inactive: "secondary",
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this truck?")) {
      try {
        await deleteTruck(id).unwrap();
        toast.success("Truck deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete truck");
      }
    }
  };

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <div>Error loading trucks</div>;

  return (
    <div
      style={{
        backgroundColor: "#9faaf4",
        minHeight: "94vh",
        width: "100%",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // Align top of content
        paddingTop: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1000, padding: "0 1rem" }}>
        <h3 className="mb-3 text-center">Truck List</h3>
        {(user?.role === "owner" || user?.role === "admin") && (
          <div className="text-center mb-3">
            <Button as={Link} to="/trucks/new" variant="primary">
              Add New Truck
            </Button>
          </div>
        )}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Plate Number</th>
              <th>Condition</th>
              <th>Mileage Factor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks && trucks.length > 0 ? (
              trucks.map((truck) => (
                <tr key={truck._id}>
                  <td>
                    <Link to={`/trucks/${truck._id}`}>
                      {truck.plate_number}
                    </Link>
                  </td>
                  <td>
                    <Badge bg={conditionColors[truck.condition] || "primary"}>
                      {truck.condition.replace(/_/g, " ")}
                    </Badge>
                  </td>
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
                      <FaEye />
                    </Button>

                    <Button
                      as={Link}
                      to={`/trucks/${truck._id}/edit`}
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      title="Edit Truck"
                    >
                      <FaEdit />
                    </Button>

                    {(user?.role === "owner" || user?.role === "admin") && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        title="Delete Truck"
                        onClick={() => handleDelete(truck._id)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No trucks available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TruckList;
