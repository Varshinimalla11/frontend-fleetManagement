import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Table,
  Badge,
} from "react-bootstrap";
import {
  useGetDashboardStatsQuery,
  useGetRecentTripsQuery,
  useGetRecentDriveSessionsQuery,
} from "./dashboardApi";
import moment from "moment";

const Dashboard = () => {
  const { data: stats, isLoading: loadingStats } = useGetDashboardStatsQuery();
  const { data: recentTrips = [], isLoading: loadingTrips } =
    useGetRecentTripsQuery();
  const { data: recentSessions = [], isLoading: loadingSessions } =
    useGetRecentDriveSessionsQuery();

  if (loadingStats || loadingTrips || loadingSessions) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Trips</Card.Title>
              <h3>{stats?.totalTrips}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Trucks</Card.Title>
              <h3>{stats?.totalTrucks}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Drivers</Card.Title>
              <h3>{stats?.totalDrivers}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Ongoing Trips</Card.Title>
              <h3>{stats?.ongoingTrips}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Recent Trips</Card.Header>
            <Card.Body>
              <Table responsive hover size="sm">
                <thead>
                  <tr>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip) => (
                    <tr key={trip._id}>
                      <td>{trip.start_city}</td>
                      <td>{trip.end_city}</td>
                      <td>
                        <Badge
                          bg={
                            trip.status === "ongoing"
                              ? "primary"
                              : trip.status === "completed"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {trip.status}
                        </Badge>
                      </td>
                      <td>{moment(trip.startDate).format("MMM DD, YYYY")}</td>
                    </tr>
                  ))}
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
                    <th>Driver</th>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((session) => (
                    <tr key={session._id}>
                      <td>
                        {session.trip_id?.start_city} →{" "}
                        {session.trip_id?.end_city}
                      </td>
                      <td>{session.driver_id?.name}</td>
                      <td>
                        {moment(session.startTime).format("MMM DD, YYYY HH:mm")}
                      </td>
                      <td>
                        {session.endTime
                          ? moment(session.endTime).format("MMM DD, YYYY HH:mm")
                          : "Ongoing"}
                      </td>
                    </tr>
                  ))}
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
