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
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <div>Loading dashboard...</div>
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
        <Container fluid>
          <Row className="mb-5">
            <Col>
              <div
                className="text-center text-white p-5 rounded-4 shadow-lg position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
                  }}
                ></div>
                <div className="position-relative">
                  <div className="mb-4">
                    <i
                      className="fas fa-tachometer-alt"
                      style={{
                        fontSize: "4rem",
                        textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                        filter:
                          "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
                      }}
                    ></i>
                  </div>
                  <h1
                    className="fw-bold mb-3"
                    style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
                  >
                    Welcome back, {user?.name || "User"}!
                  </h1>
                  <p
                    className="mb-0 fs-4 opacity-90"
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
                  >
                    <i className="fas fa-calendar-day me-2"></i>
                    {moment().format("dddd, MMMM Do YYYY")}
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-5 dashboard-stats g-4">
            {isDriver ? (
              <Col md={6} lg={6}>
                <Card
                  className="h-100 border-0 shadow-lg rounded-4 bg-gradient position-relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    className="position-absolute top-0 end-0 opacity-25"
                    style={{
                      width: "80px",
                      height: "80px",
                      background:
                        "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                    }}
                  ></div>
                  <Card.Body className="text-center text-white p-3 position-relative">
                    <div className="mb-2">
                      <i
                        className="fas fa-clipboard-list"
                        style={{
                          fontSize: "2.5rem",
                          textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                          filter:
                            "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
                        }}
                      ></i>
                    </div>
                    <h6 className="fw-semibold opacity-90 mb-2 text-uppercase tracking-wider">
                      Total Assigned Trips
                    </h6>
                    <h2
                      className="fw-bold mb-0"
                      style={{
                        fontSize: "2.5rem",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {tripsCount}
                    </h2>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col md={6} lg={6}>
                <Card
                  className="h-100 border-0 shadow-lg rounded-4 bg-gradient position-relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    className="position-absolute top-0 end-0 opacity-25"
                    style={{
                      width: "80px",
                      height: "80px",
                      background:
                        "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                    }}
                  ></div>
                  <Card.Body className="text-center text-white p-3 position-relative">
                    <div className="mb-2">
                      <i
                        className="fas fa-route"
                        style={{
                          fontSize: "2.5rem",
                          textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                          filter:
                            "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
                        }}
                      ></i>
                    </div>
                    <h6 className="fw-semibold opacity-90 mb-2 text-uppercase tracking-wider">
                      Total Trips
                    </h6>
                    <h2
                      className="fw-bold mb-0"
                      style={{
                        fontSize: "2.5rem",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {stats?.totalTrips ?? 0}
                    </h2>
                  </Card.Body>
                </Card>
              </Col>
            )}
            <Col md={6} lg={6}>
              <Card
                className="h-100 border-0 shadow-lg rounded-4 bg-gradient position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(240, 147, 251, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  className="position-absolute top-0 end-0 opacity-25"
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                  }}
                ></div>
                <Card.Body className="text-center text-white p-3 position-relative">
                  <div className="mb-2">
                    <i
                      className="fas fa-truck"
                      style={{
                        fontSize: "2.5rem",
                        textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                        filter:
                          "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
                      }}
                    ></i>
                  </div>
                  <h6 className="fw-semibold opacity-90 mb-2 text-uppercase tracking-wider">
                    Total Trucks
                  </h6>
                  <h2
                    className="fw-bold mb-0"
                    style={{
                      fontSize: "2.5rem",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {trucksCount}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
            {(isOwner || isAdmin) && (
              <Col md={6} lg={6}>
                <Card
                  className="h-100 border-0 shadow-lg rounded-4 bg-gradient position-relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(79, 172, 254, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    className="position-absolute top-0 end-0 opacity-25"
                    style={{
                      width: "80px",
                      height: "80px",
                      background:
                        "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                    }}
                  ></div>
                  <Card.Body className="text-center text-white p-3 position-relative">
                    <div className="mb-2">
                      <i
                        className="fas fa-users"
                        style={{
                          fontSize: "2.5rem",
                          textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                          filter:
                            "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
                        }}
                      ></i>
                    </div>
                    <h6 className="fw-semibold opacity-90 mb-2 text-uppercase tracking-wider">
                      Total Drivers
                    </h6>
                    <h2
                      className="fw-bold mb-0"
                      style={{
                        fontSize: "2.5rem",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {driversCount}
                    </h2>
                  </Card.Body>
                </Card>
              </Col>
            )}
            <Col md={6} lg={6}>
              <Card
                className="h-100 border-0 shadow-lg rounded-4 bg-gradient position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(250, 112, 154, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  className="position-absolute top-0 end-0 opacity-25"
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                  }}
                ></div>
                <Card.Body className="text-center text-white p-3 position-relative">
                  <div className="mb-2">
                    <i
                      className="fas fa-play-circle"
                      style={{
                        fontSize: "2.5rem",
                        textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                        filter:
                          "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
                      }}
                    ></i>
                  </div>
                  <h6 className="fw-semibold opacity-90 mb-2 text-uppercase tracking-wider">
                    Ongoing Trips
                  </h6>
                  <h2
                    className="fw-bold mb-0"
                    style={{
                      fontSize: "2.5rem",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {ongoingTripsCount}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <div
                className="p-5 rounded-4 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark mb-2">Quick Actions</h3>
                  <p className="text-muted mb-0">
                    Access your recent trips and drive sessions
                  </p>
                </div>
                <Row className="g-4">
                  <Col md={6} className="text-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleOpenTripsModal}
                      className="px-5 py-4 fw-semibold rounded-pill shadow-lg border-0 position-relative overflow-hidden w-100"
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        transition: "all 0.3s ease",
                        transform: "translateY(0)",
                        minHeight: "70px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-5px)";
                        e.target.style.boxShadow =
                          "0 15px 30px rgba(102, 126, 234, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "";
                      }}
                    >
                      <FaCar className="me-3" style={{ fontSize: "1.5rem" }} />
                      <span style={{ fontSize: "1.1rem" }}>
                        View Recent Trips
                      </span>
                    </Button>
                  </Col>
                  <Col md={6} className="text-center">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleOpenSessionsModal}
                      className="px-5 py-4 fw-semibold rounded-pill shadow-lg border-0 position-relative overflow-hidden w-100"
                      style={{
                        background:
                          "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        transition: "all 0.3s ease",
                        transform: "translateY(0)",
                        minHeight: "70px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-5px)";
                        e.target.style.boxShadow =
                          "0 15px 30px rgba(79, 172, 254, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "";
                      }}
                    >
                      <FaClock
                        className="me-3"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span style={{ fontSize: "1.1rem" }}>
                        View Recent Drive Sessions
                      </span>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Modal
            show={showTripsModal}
            onHide={handleCloseModal}
            centered
            size="lg"
            scrollable
          >
            <Modal.Header
              closeButton
              className="bg-primary text-white border-0"
            >
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
                  <div className="text-muted fs-5">No recent trips found.</div>
                </div>
              ) : (
                <Table striped hover responsive="sm" className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="fw-semibold text-muted py-3">
                        <i className="fas fa-map-marker-alt me-2"></i>Origin
                      </th>
                      <th className="fw-semibold text-muted py-3">
                        <i className="fas fa-flag-checkered me-2"></i>
                        Destination
                      </th>
                      <th className="fw-semibold text-muted py-3">
                        <i className="fas fa-info-circle me-2"></i>Status
                      </th>
                      <th className="fw-semibold text-muted py-3">
                        <i className="fas fa-calendar me-2"></i>Start Date
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
                            className="px-3 py-2 rounded-pill fw-semibold"
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
            <Modal.Footer className="border-0">
              <Button
                variant="outline-secondary"
                onClick={handleCloseModal}
                className="rounded-pill px-4"
              >
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
            <Modal.Header
              closeButton
              className="bg-success text-white border-0"
            >
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
                  <div className="text-muted fs-5">
                    No drive sessions found.
                  </div>
                </div>
              ) : (
                <Table striped hover responsive="sm" className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="fw-semibold text-muted py-3">
                        <i className="fas fa-route me-2"></i>Trip
                      </th>
                      <th className="fw-semibold text-muted py-3">
                        <i className="fas fa-play me-2"></i>Start
                      </th>
                      <th className="fw-semibold text-muted py-3">
                        <i className="fas fa-stop me-2"></i>End
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
                            <Badge
                              bg="info"
                              className="px-3 py-2 rounded-pill fw-semibold"
                            >
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
            <Modal.Footer className="border-0">
              <Button
                variant="outline-secondary"
                onClick={handleCloseModal}
                className="rounded-pill px-4"
              >
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
