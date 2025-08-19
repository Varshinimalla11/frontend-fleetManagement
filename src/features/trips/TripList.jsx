import {
  useGetTripsQuery,
  useDeleteTripMutation,
  useRestoreTripMutation,
  useGetMyTripsQuery,
} from "../../api/tripsApi";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Spinner,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const TripList = () => {
  const { user } = useAuth();
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteTrip] = useDeleteTripMutation();
  const [restoreTrip] = useRestoreTripMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const { refetch } = useGetDashboardStatsQuery(undefined, { skip: false });
  const location = useLocation();

  // Always call both hooks (React Hooks must not be conditional!)
  const tripsResult = useGetTripsQuery(
    { showDeleted },
    { pollingInterval: 6000 }
  );
  const myTripsResult = useGetMyTripsQuery(undefined, {
    pollingInterval: 6000,
  });
  const isDriver = user?.role === "driver";

  useEffect(() => {
    myTripsResult.refetch();
  }, [location, myTripsResult.refetch]);

  // Driver sees only their trips; others see trips according to showDeleted toggle
  const trips = isDriver ? myTripsResult.data || [] : tripsResult.data || [];
  const isLoading = isDriver ? myTripsResult.isLoading : tripsResult.isLoading;
  const error = isDriver ? myTripsResult.error : tripsResult.error;

  // Only non-drivers can toggle showDeleted
  const filteredTrips = isDriver
    ? trips // drivers never see deleted
    : trips.filter((trip) => (showDeleted ? trip.isDeleted : !trip.isDeleted));

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTrip(tripToDelete._id).unwrap();
      toast.success("Trip deleted successfully");
      refetch();
    } catch {
      toast.error("Error deleting trip");
    } finally {
      setShowDeleteModal(false);
      setTripToDelete(null);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreTrip(id).unwrap();
      toast.success("Trip restored!");
      refetch();
    } catch {
      toast.error("Failed to restore trip");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: "secondary",
      ongoing: "primary",
      completed: "success",
      cancelled: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <Container>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

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
        paddingTop: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
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
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              {isDriver ? "My Trips" : showDeleted ? "Deleted Trips" : "Trips"}
            </h1>
            <div>
              {!isDriver && (
                <Button
                  variant={showDeleted ? "outline-secondary" : "outline-danger"}
                  className="me-2"
                  onClick={() => setShowDeleted(!showDeleted)}
                >
                  {showDeleted ? "Show Active Trips" : "Show Deleted Trips"}
                </Button>
              )}
              {(user.role === "owner" || user.role === "admin") &&
                !showDeleted && (
                  <Button as={Link} to="/trips/new" variant="primary">
                    <i className="fas fa-plus me-2"></i>
                    Create New Trip
                  </Button>
                )}
            </div>
          </div>
        </Col>

        <Row>
          <Col>
            <Card>
              <Card.Body>
                {filteredTrips.length > 0 ? (
                  <Table striped bordered responsive hover>
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
                      {filteredTrips.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">
                            {isDriver
                              ? "No assigned trips."
                              : showDeleted
                              ? "No deleted trips."
                              : "No active trips."}
                          </td>
                        </tr>
                      ) : (
                        filteredTrips.map((trip) => (
                          <tr
                            key={trip._id}
                            className={
                              trip.isDeleted ? "text-center text-muted" : ""
                            }
                            style={
                              trip.isDeleted
                                ? { textDecoration: "line-through" }
                                : {}
                            }
                          >
                            <td>{trip.start_city}</td>
                            <td>{trip.end_city}</td>
                            <td>
                              {trip.truck_id
                                ? trip.truck_id.plate_number
                                : "Unassigned"}
                            </td>
                            <td>
                              {trip.driver_id
                                ? trip.driver_id.name
                                : "Unassigned"}
                            </td>
                            <td>
                              {moment(trip.start_time).format("MMM DD, YYYY")}
                            </td>
                            <td>{getStatusBadge(trip.status)}</td>
                            <td>
                              {!trip.isDeleted ? (
                                <div className="btn-group" role="group">
                                  <Button
                                    as={Link}
                                    to={`/trips/${trip._id}`}
                                    variant="outline-primary"
                                    size="sm"
                                    title="View"
                                  >
                                    <FaEye />
                                  </Button>
                                  {(user.role === "owner" ||
                                    user.role === "admin") && (
                                    <>
                                      <Button
                                        as={Link}
                                        to={`/trips/${trip._id}/edit`}
                                        variant="outline-success"
                                        size="sm"
                                        title="Edit"
                                        disabled={
                                          trip.status === "completed" ||
                                          trip.status === "cancelled"
                                        }
                                      >
                                        <FaEdit />
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(trip)}
                                        title="Delete"
                                        disabled={
                                          trip.status === "completed" ||
                                          trip.status === "cancelled"
                                        }
                                      >
                                        <FaTrash />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleRestore(trip._id)}
                                  title="Restore"
                                >
                                  Restore
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-route fa-3x text-muted mb-3"></i>
                    <p className="text-center py-5">
                      No{" "}
                      {showDeleted
                        ? "deleted"
                        : isDriver
                        ? "assigned"
                        : "active"}{" "}
                      trips found.
                    </p>
                    {(user.role === "owner" || user.role === "admin") &&
                      !showDeleted && (
                        <Button as={Link} to="/trips/new" variant="primary">
                          Create New Trip
                        </Button>
                      )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default TripList;
