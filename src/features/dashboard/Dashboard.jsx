import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import {
  useGetDashboardStatsQuery,
  useGetRecentTripsQuery,
  useGetRecentDriveSessionsQuery,
} from "../../api/dashboardApi";
import { useGetTripsQuery, useGetMyTripsQuery } from "../../api/tripsApi";
import { useGetTrucksQuery } from "../../api/trucksApi";
import moment from "moment";
import { FaClock, FaCar } from "react-icons/fa";
import fleetLandingImage from "../../assets/fleetLandingImage.jpg";

const Dashboard = () => {
  const { user } = useAuth();

  const isDriver = user?.role === "driver";
  const isOwner = user?.role === "owner";
  const isAdmin = user?.role === "admin";

  // Call all hooks always, but use `skip` option so they only fetch if needed
  const { data: trucks = [], isLoading: loadingTrucks } = useGetTrucksQuery(
    undefined,
    {
      skip: !isOwner && !isAdmin,
    }
  );

  const { data: driverTrips = [], isLoading: loadingDriverTrips } =
    useGetMyTripsQuery(undefined, {
      skip: !isDriver,
      pollingInterval: 6000,
    });

  const { data: allTrips = [], isLoading: loadingAllTrips } = useGetTripsQuery(
    undefined,
    {
      skip: isDriver,
      pollingInterval: 6000,
    }
  );

  const { data: stats, isLoading: loadingStats } = useGetDashboardStatsQuery(
    undefined,
    {
      skip: isDriver,
      pollingInterval: 6000,
    }
  );

  const { data: recentTrips = [], isLoading: loadingRecentTrips } =
    useGetRecentTripsQuery(undefined, {
      skip: isDriver,
      pollingInterval: 6000,
    });

  const { data: recentSessions = [], isLoading: loadingRecentSessions } =
    useGetRecentDriveSessionsQuery(undefined, { pollingInterval: 6000 });

  // Choose correct trips based on role (after hooks are always run)
  const trips = isDriver ? driverTrips : allTrips;
  const loadingTrips = isDriver ? loadingDriverTrips : loadingAllTrips;

  // Loading states
  const loadingUser = !user;
  const loading =
    loadingUser ||
    loadingTrucks ||
    loadingTrips ||
    (loadingStats && !isDriver) ||
    loadingRecentTrips ||
    loadingRecentSessions;

  // Counts
  const trucksCount = isOwner ? trucks.length : stats?.totalTrucks ?? 0;
  const tripsCount = trips.length;
  const driversCount = isOwner || isAdmin ? stats?.totalDrivers ?? 0 : null;
  const ongoingTripsCount = isDriver
    ? trips.filter((t) => t.status === "ongoing").length
    : stats?.ongoingTrips ?? 0;
  console.log("Driver trips:", driverTrips);

  const filteredRecentTrips =
    isOwner || isAdmin
      ? recentTrips.filter((trip) => trip.owner_id === user._id)
      : isDriver
      ? driverTrips.slice(0, 10) || []
      : recentTrips;
  console.log("Filtered recent trips for user", filteredRecentTrips);
  // Modal state
  const [showTripsModal, setShowTripsModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  const handleOpenTripsModal = () => {
    setShowTripsModal(true);
    setShowSessionsModal(false);
  };
  const handleOpenSessionsModal = () => {
    setShowSessionsModal(true);
    setShowTripsModal(false);
  };
  const handleCloseModal = () => {
    setShowTripsModal(false);
    setShowSessionsModal(false);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <div>Loading dashboard...</div>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${fleetLandingImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)", // white overlay for readability
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Container fluid>
          <Row className="mb-4 dashboard-stats">
            {isDriver ? (
              <Col md={6}>
                <Card className="mb-3 text-center">
                  <Card.Body>
                    <h4>Total Assigned Trips</h4>
                    <h2>{tripsCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col>
                <Card className="mb-3 text-center">
                  <Card.Body>
                    <h4>Total Trips</h4>
                    <h2>{stats?.totalTrips ?? 0}</h2>
                  </Card.Body>
                </Card>
              </Col>
            )}
            <Col>
              <Card className="mb-3 text-center">
                <Card.Body>
                  <h4>Total Trucks</h4>
                  <h2>{trucksCount}</h2>
                </Card.Body>
              </Card>
            </Col>
            {(isOwner || isAdmin) && (
              <Col>
                <Card className="mb-3 text-center">
                  <Card.Body>
                    <h4>Total Drivers</h4>
                    <h2>{driversCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
            )}
            <Col>
              <Card className="mb-3 text-center">
                <Card.Body>
                  <h4>Ongoing Trips</h4>
                  <h2>{ongoingTripsCount}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} className="text-center mb-3">
              {/* Show only for non-driver roles */}

              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenTripsModal}
              >
                <FaCar className="me-2" />
                View Recent Trips
              </Button>
            </Col>
            <Col md={6} className="text-center mb-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleOpenSessionsModal}
              >
                <FaClock className="me-2" />
                View Recent Drive Sessions
              </Button>
            </Col>
          </Row>

          {/* Recent Trips Modal */}
          <Modal
            show={showTripsModal}
            onHide={handleCloseModal}
            centered
            size="lg"
            scrollable
          >
            <Modal.Header closeButton>
              <Modal.Title>Recent Trips</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {filteredRecentTrips.length === 0 ? (
                <div className="text-muted text-center">
                  No recent trips found.
                </div>
              ) : (
                <Table striped bordered hover responsive="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Start Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecentTrips.slice(0, 10).map((trip) => (
                      <tr key={trip._id}>
                        <td>{trip.start_city}</td>
                        <td>{trip.end_city}</td>
                        <td>
                          <Badge
                            bg={
                              trip.status === "scheduled"
                                ? "secondary"
                                : trip.status === "ongoing"
                                ? "primary"
                                : trip.status === "completed"
                                ? "success"
                                : "danger"
                            }
                          >
                            {trip.status}
                          </Badge>
                        </td>
                        <td>
                          {moment(trip.start_time).format("MMM DD, YYYY")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Recent Drive Sessions Modal */}
          <Modal
            show={showSessionsModal}
            onHide={handleCloseModal}
            centered
            size="lg"
            scrollable
          >
            <Modal.Header closeButton>
              <Modal.Title>Recent Drive Sessions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {recentSessions.length === 0 ? (
                <div className="text-muted text-center">
                  No drive sessions found.
                </div>
              ) : (
                <Table striped bordered hover responsive="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Trip</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.slice(0, 10).map((session) => (
                      <tr key={session._id}>
                        <td>
                          {session.trip_id?.start_city} →{" "}
                          {session.trip_id?.end_city}
                        </td>
                        <td>
                          {moment(session.start_time).format(
                            "MMM DD, YYYY HH:mm"
                          )}
                        </td>
                        <td>
                          {session.end_time ? (
                            moment(session.end_time).format(
                              "MMM DD, YYYY HH:mm"
                            )
                          ) : (
                            <Badge bg="info">Ongoing</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
