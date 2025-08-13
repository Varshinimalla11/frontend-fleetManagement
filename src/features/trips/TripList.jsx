import { useGetTripsQuery, useDeleteTripMutation } from "./tripsApi";
import { Button, Table, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";

const TripList = () => {
  const { data: trips = [], isLoading } = useGetTripsQuery();
  const [deleteTrip] = useDeleteTripMutation();
  const { user } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  const handleDeleteConfirm = async () => {
    try {
      await deleteTrip(tripToDelete._id).unwrap();
      toast.success("Trip deleted successfully");
    } catch {
      toast.error("Error deleting trip");
    } finally {
      setShowDeleteModal(false);
      setTripToDelete(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: "secondary",
      ongoing: "primary",
      completed: "success",
      cancelled: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Truck</th>
            <th>Driver</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip._id}>
              <td>{trip.start_city}</td>
              <td>{trip.end_city}</td>
              <td>{trip.truck_id?.plate_number || "Unassigned"}</td>
              <td>{trip.driver_id?.name || "Unassigned"}</td>
              <td>{moment(trip.startDate).format("MMM DD, YYYY")}</td>
              <td>{getStatusBadge(trip.status)}</td>
              <td>
                <Button
                  as={Link}
                  to={`/trips/${trip._id}`}
                  variant="outline-primary"
                  size="sm"
                >
                  View
                </Button>
                {(user.role === "owner" || user.role === "admin") && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setTripToDelete(trip);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this trip from{" "}
          {tripToDelete?.start_city} to {tripToDelete?.end_city}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TripList;
