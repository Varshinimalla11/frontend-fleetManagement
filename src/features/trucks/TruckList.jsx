// src/components/TruckList.jsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Container,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const { refetch } = useGetDashboardStatsQuery(undefined, { skip: false });

  const conditionColors = {
    active: "success",
    maintenance_needed: "warning",
    in_maintenance: "danger",
    inactive: "secondary",
  };
  const handleShowDeleteModal = (truck) => {
    setSelectedTruck(truck);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTruck(null);
  };

  const handleDelete = async () => {
    try {
      await deleteTruck(selectedTruck._id).unwrap();
      toast.success("Truck deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete truck");
    } finally {
      handleCloseDeleteModal();
      navigate("/trucks");
    }
  };

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <div>Error loading trucks</div>;

  return (
    <div className="bg-primary bg-opacity-25 min-vh-100 py-4">
      <div className="container-fluid" style={{ maxWidth: "1000px" }}>
        <div className="bg-white rounded-4 shadow-lg p-4">
          <h3 className="mb-4 text-center fw-bold text-primary">
            Truck Fleet Management
          </h3>
          {(user?.role === "owner" || user?.role === "admin") && (
            <div className="text-center mb-4">
              <Button
                as={Link}
                to="/trucks/new"
                variant="primary"
                className="btn-lg px-4 py-2 fw-semibold rounded-3 shadow-sm"
              >
                <i className="fas fa-plus me-2"></i>
                Add New Truck
              </Button>
            </div>
          )}

          <div className="table-responsive rounded-3 shadow-sm">
            <Table className="table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="fw-semibold text-muted py-3">Plate Number</th>
                  <th className="fw-semibold text-muted py-3">Condition</th>
                  <th className="fw-semibold text-muted py-3">
                    Mileage Factor
                  </th>
                  <th className="fw-semibold text-muted py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trucks && trucks.length > 0 ? (
                  trucks.map((truck) => (
                    <tr key={truck._id} className="border-bottom">
                      <td className="py-3">
                        <Link
                          to={`/trucks/${truck._id}`}
                          className="text-decoration-none fw-semibold"
                        >
                          {truck.plate_number}
                        </Link>
                      </td>
                      <td className="py-3">
                        <Badge
                          bg={conditionColors[truck.condition] || "primary"}
                          className="px-3 py-2 rounded-pill"
                        >
                          {truck.condition.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 fw-semibold">
                        {truck.mileage_factor}
                      </td>
                      <td className="py-3">
                        <div className="d-flex gap-2">
                          <Button
                            as={Link}
                            to={`/trucks/${truck._id}`}
                            variant="outline-primary"
                            size="sm"
                            className="rounded-3"
                            title="View Truck"
                          >
                            <FaEye />
                          </Button>

                          <Button
                            as={Link}
                            to={`/trucks/${truck._id}/edit`}
                            variant="outline-success"
                            size="sm"
                            className="rounded-3"
                            title="Edit Truck"
                          >
                            <FaEdit />
                          </Button>

                          {(user?.role === "owner" ||
                            user?.role === "admin") && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="rounded-3"
                              title="Delete Truck"
                              onClick={() => handleShowDeleteModal(truck)}
                            >
                              <FaTrash />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      <i className="fas fa-truck fa-3x mb-3 text-muted"></i>
                      <div>No trucks available</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Modal
            show={showDeleteModal}
            onHide={handleCloseDeleteModal}
            centered
          >
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="fw-bold text-danger">
                Confirm Delete
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="py-4">
              <div className="text-center">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <p className="mb-0">
                  Are you sure you want to delete truck{" "}
                  <strong className="text-primary">
                    {selectedTruck?.plate_number}
                  </strong>
                  ?
                </p>
              </div>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0">
              <Button
                variant="outline-secondary"
                onClick={handleCloseDeleteModal}
                className="rounded-3 px-4"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-3 px-4 fw-semibold"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TruckList;
