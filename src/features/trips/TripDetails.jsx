import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetTripByIdQuery } from "./tripsApi";
import { useGetDriveSessionsByTripQuery } from "../driveSessions/driveSessionsApi";
import { useGetRefuelEventsByTripQuery } from "../refuelEvents/refuelEventsApi";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Table,
} from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: trip,
    isLoading: tripLoading,
    isError: tripError,
  } = useGetTripByIdQuery(id);
  const { data: driveSessions = [] } = useGetDriveSessionsByTripQuery(id);
  const { data: refuelEvents = [] } = useGetRefuelEventsByTripQuery(id);

  if (tripLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border" role="status"></div>
      </Container>
    );
  }

  if (tripError || !trip) {
    toast.error("Error loading trip details");
    return (
      <Container className="py-5 text-center">
        <h4>Trip not found</h4>
        <Button as={Link} to="/trips" variant="primary">
          Back to Trips
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Trip Details</h1>
            <Button variant="secondary" onClick={() => navigate("/trips")}>
              <i className="fas fa-arrow-left me-2"></i> Back to Trips
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          {/* Trip Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Trip Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Origin:</strong> {trip.start_city}
                  </p>
                  <p>
                    <strong>Destination:</strong> {trip.end_city}
                  </p>
                  <p>
                    <strong>Status:</strong> {trip.status}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {moment(trip.start_date).format("MMM DD, YYYY HH:mm")}
                  </p>
                  {trip.end_date && (
                    <p>
                      <strong>End Date:</strong>{" "}
                      {moment(trip.end_date).format("MMM DD, YYYY HH:mm")}
                    </p>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Drive Sessions */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Drive Sessions</h5>
            </Card.Header>
            <Card.Body>
              {driveSessions.length > 0 ? (
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driveSessions.map((session) => (
                      <tr key={session._id}>
                        <td>
                          {moment(session.startTime).format("MMM DD, HH:mm")}
                        </td>
                        <td>
                          {session.endTime
                            ? moment(session.endTime).format("MMM DD, HH:mm")
                            : "Ongoing"}
                        </td>
                        <td>
                          {session.endTime
                            ? moment
                                .duration(
                                  moment(session.endTime).diff(
                                    moment(session.startTime)
                                  )
                                )
                                .humanize()
                            : "Ongoing"}
                        </td>
                        <td>
                          <Badge
                            bg={
                              session.status === "active"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {session.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">
                  No drive sessions recorded for this trip.
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Refuel Events */}
          <Card>
            <Card.Header>
              <h5>Refuel Events</h5>
            </Card.Header>
            <Card.Body>
              {refuelEvents.length > 0 ? (
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Amount</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refuelEvents.map((event) => (
                      <tr key={event._id}>
                        <td>{moment(event.date).format("MMM DD, YYYY")}</td>
                        <td>{event.location}</td>
                        <td>{event.fuelAmount} L</td>
                        <td>${event.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">
                  No refuel events recorded for this trip.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Sidebar */}
        <Col md={4}>
          {/* Assigned Resources */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Assigned Resources</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Truck:</strong>
                {trip.truck_id ? (
                  <div>
                    <p>{trip.truck_id.plate_number}</p>
                    <p>
                      <strong>Condition:</strong>{" "}
                      {trip.truck_id.condition || "N/A"}
                    </p>
                    <p>
                      <strong>Mileage:</strong>{" "}
                      {trip.truck_id.mileage_factor || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p>No truck assigned</p>
                )}
              </div>
              <div>
                <strong>Driver:</strong>
                {trip.driver_id ? (
                  <div>
                    <p>
                      <strong>Name:</strong> {trip.driver_id.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {trip.driver_id.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {trip.driver_id.phone}
                    </p>
                  </div>
                ) : (
                  <p>No driver assigned</p>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Trip Statistics */}
          <Card>
            <Card.Header>
              <h5>Trip Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div>
                <strong>Total Drive Sessions:</strong> {driveSessions.length}
              </div>
              <div>
                <strong>Total Refuel Events:</strong> {refuelEvents.length}
              </div>
              <div>
                <strong>Total Fuel Cost:</strong> $
                {refuelEvents.reduce((t, e) => t + e.cost, 0).toFixed(2)}
              </div>
              <div>
                <strong>Total Fuel Amount:</strong>{" "}
                {refuelEvents.reduce((t, e) => t + e.fuelAmount, 0).toFixed(1)}{" "}
                L
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TripDetails;
