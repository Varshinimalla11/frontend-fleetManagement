import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
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

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <strong>Recent Trips</strong>
            </Card.Header>
            <Card.Body>
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(isDriver ? trips : recentTrips).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No trips found.
                      </td>
                    </tr>
                  ) : (
                    (isDriver ? trips : recentTrips).slice(0, 5).map((trip) => (
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
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Recent Drive Sessions</Card.Header>
            <Card.Body>
              <Table responsive hover size="sm">
                <thead>
                  <tr>
                    <th>Trip</th>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No drive sessions found.
                      </td>
                    </tr>
                  ) : (
                    recentSessions.slice(0, 5).map((session) => (
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
                          {session.end_time
                            ? moment(session.end_time).format(
                                "MMM DD, YYYY HH:mm"
                              )
                            : "Ongoing"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
