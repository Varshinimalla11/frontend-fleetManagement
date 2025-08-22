"use client";

import { useState } from "react";
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
import "./dashboard.css";

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
    useGetRecentDriveSessionsQuery(undefined, {
      pollingInterval: 6000,
    });

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
      <Container className="mt-5 text-center">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "50vh" }}
        >
          <Spinner
            animation="border"
            variant="primary"
            size="lg"
            className="mb-3"
          />
          <h5 className="text-muted">Loading dashboard...</h5>
        </div>
      </Container>
    );
  }

  return (
    <div
      className="dashboard-bg"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(248, 249, 250, 0.4), rgba(233, 236, 239, 0.4)),
          url(${fleetLandingImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "transparent",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm bg-primary text-white">
                <Card.Body className="text-center py-5">
                  <div className="mb-3">
                    <i className="fas fa-tachometer-alt display-3"></i>
                  </div>
                  <h1 className="fw-bold mb-3">
                    Welcome back, {user?.name || "User"}!
                  </h1>
                  <p className="mb-0 fs-5 opacity-75">
                    <i className="fas fa-calendar-day me-2"></i>
                    {moment().format("dddd, MMMM Do YYYY")}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4 g-4">
            {isDriver ? (
              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 bg-primary text-white">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-clipboard-list display-4"></i>
                    </div>
                    <h6 className="text-uppercase fw-semibold opacity-75 mb-2">
                      Total Assigned Trips
                    </h6>
                    <h2 className="fw-bold mb-0 display-5">{tripsCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 bg-primary text-white">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-route display-4"></i>
                    </div>
                    <h6 className="text-uppercase fw-semibold opacity-75 mb-2">
                      Total Trips
                    </h6>
                    <h2 className="fw-bold mb-0 display-5">
                      {stats?.totalTrips ?? 0}
                    </h2>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {(isOwner || isAdmin) && (
              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 bg-success text-white">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-truck display-4"></i>
                    </div>
                    <h6 className="text-uppercase fw-semibold opacity-75 mb-2">
                      Total Trucks
                    </h6>
                    <h2 className="fw-bold mb-0 display-5">{trucksCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {(isOwner || isAdmin) && (
              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 bg-info text-white">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-users display-4"></i>
                    </div>
                    <h6 className="text-uppercase fw-semibold opacity-75 mb-2">
                      Total Drivers
                    </h6>
                    <h2 className="fw-bold mb-0 display-5">{driversCount}</h2>
                  </Card.Body>
                </Card>
              </Col>
            )}

            <Col md={6} lg={3}>
              <Card className="border-0 shadow-sm h-100 bg-warning text-white">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-play-circle display-4"></i>
                  </div>
                  <h6 className="text-uppercase fw-semibold opacity-75 mb-2">
                    Ongoing Trips
                  </h6>
                  <h2 className="fw-bold mb-0 display-5">
                    {ongoingTripsCount}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-dark mb-2">Quick Actions</h3>
                    <p className="text-muted mb-0">
                      Access your recent trips and drive sessions
                    </p>
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleOpenTripsModal}
                        className="w-100 py-3 fw-semibold d-flex align-items-center justify-content-center"
                      >
                        <FaCar className="me-2" />
                        View Recent Trips
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        variant="success"
                        size="lg"
                        onClick={handleOpenSessionsModal}
                        className="w-100 py-3 fw-semibold d-flex align-items-center justify-content-center"
                      >
                        <FaClock className="me-2" />
                        View Recent Drive Sessions
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Modal
            show={showTripsModal}
            onHide={handleCloseModal}
            centered
            size="lg"
            scrollable
          >
            <Modal.Header closeButton className="bg-primary text-white">
              <Modal.Title className="fw-bold">
                <FaCar className="me-2" />
                Recent Trips
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              {filteredRecentTrips.length === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="fas fa-route text-muted mb-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="text-muted">No recent trips found.</h5>
                </div>
              ) : (
                <Table striped hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold py-3">
                        <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                        Origin
                      </th>
                      <th className="fw-semibold py-3">
                        <i className="fas fa-flag-checkered me-2 text-muted"></i>
                        Destination
                      </th>
                      <th className="fw-semibold py-3">
                        <i className="fas fa-info-circle me-2 text-muted"></i>
                        Status
                      </th>
                      <th className="fw-semibold py-3">
                        <i className="fas fa-calendar me-2 text-muted"></i>Start
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecentTrips.slice(0, 10).map((trip) => (
                      <tr key={trip._id}>
                        <td className="py-3 fw-semibold">{trip.start_city}</td>
                        <td className="py-3 fw-semibold">{trip.end_city}</td>
                        <td className="py-3">
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
                            className="px-3 py-2 fw-semibold"
                          >
                            {trip.status}
                          </Badge>
                        </td>
                        <td className="py-3">
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

          <Modal
            show={showSessionsModal}
            onHide={handleCloseModal}
            centered
            size="lg"
            scrollable
          >
            <Modal.Header closeButton className="bg-success text-white">
              <Modal.Title className="fw-bold">
                <FaClock className="me-2" />
                Recent Drive Sessions
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              {recentSessions.length === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="fas fa-clock text-muted mb-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="text-muted">No drive sessions found.</h5>
                </div>
              ) : (
                <Table striped hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold py-3">
                        <i className="fas fa-route me-2 text-muted"></i>Trip
                      </th>
                      <th className="fw-semibold py-3">
                        <i className="fas fa-play me-2 text-muted"></i>Start
                      </th>
                      <th className="fw-semibold py-3">
                        <i className="fas fa-stop me-2 text-muted"></i>End
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.slice(0, 10).map((session) => (
                      <tr key={session._id}>
                        <td className="py-3 fw-semibold">
                          {session.trip_id?.start_city} →{" "}
                          {session.trip_id?.end_city}
                        </td>
                        <td className="py-3">
                          {moment(session.start_time).format(
                            "MMM DD, YYYY HH:mm"
                          )}
                        </td>
                        <td className="py-3">
                          {session.end_time ? (
                            moment(session.end_time).format(
                              "MMM DD, YYYY HH:mm"
                            )
                          ) : (
                            <Badge bg="info" className="px-3 py-2 fw-semibold">
                              <i className="fas fa-spinner fa-spin me-1"></i>
                              Ongoing
                            </Badge>
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
