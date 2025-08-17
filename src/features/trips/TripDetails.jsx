import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import {
  useGetTripByIdQuery,
  useStartTripMutation,
  useCompleteTripMutation,
} from "../../api/tripsApi";
import {
  useGetSessionsByTripQuery,
  useEndDriveSessionAndStartRestMutation,
} from "../../api/driveSessionsApi";
import {
  useGetRestLogsByTripQuery,
  useEndRestAndStartDriveMutation,
} from "../../api/restLogsApi";
import {
  useGetRefuelLogsByTripQuery,
  useLogRefuelEventMutation,
} from "../../api/refuelEventsApi";
import { useGetNotificationsQuery } from "../../api/notificationsApi";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";

export default function TripDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: trip, refetch } = useGetTripByIdQuery(id);
  const { data: sessions = [], refetch: refetchSessions } =
    useGetSessionsByTripQuery(id);
  const { data: restLogs = [], refetch: refetchRestLogs } =
    useGetRestLogsByTripQuery(id);
  const { data: refuels = [], refetch: refetchRefuels } =
    useGetRefuelLogsByTripQuery(id);
  const { data: notifications = [], refetch: refetchNotifications } =
    useGetNotificationsQuery();

  const [startTrip] = useStartTripMutation();
  const [completeTrip] = useCompleteTripMutation();
  const [endSession] = useEndDriveSessionAndStartRestMutation();
  const [endRest] = useEndRestAndStartDriveMutation();
  const [logRefuel] = useLogRefuelEventMutation();

  const isDriver = user?.role === "driver" && user._id === trip?.driver_id?._id;

  const tripNotifications = useMemo(
    () => notifications.filter((n) => n.trip_id === trip?._id),
    [notifications, trip]
  );

  // Merge and sort timeline events
  const timelineEvents = useMemo(() => {
    const events = [];
    sessions.forEach((s) => {
      events.push({
        type: "DriveSessionStart",
        label: "Drive Start",
        id: s._id + "_start",
        time: new Date(s.start_time),
        data: s,
      });
      if (s.end_time) {
        events.push({
          type: "DriveSessionEnd",
          label: "Drive End",
          id: s._id + "_end",
          time: new Date(s.end_time),
          data: s,
        });
      }
    });
    restLogs.forEach((r) => {
      events.push({
        type: "RestStart",
        label: "Rest Start",
        id: r._id + "_start",
        time: new Date(r.rest_start_time),
        data: r,
      });
      if (r.rest_end_time) {
        events.push({
          type: "RestEnd",
          label: "Rest End",
          id: r._id + "_end",
          time: new Date(r.rest_end_time),
          data: r,
        });
      }
    });
    refuels.forEach((r) => {
      events.push({
        type: "Refuel",
        label: "Refuel",
        id: r._id,
        time: new Date(r.event_time),
        data: r,
      });
    });
    return events.sort((a, b) => a.time - b.time);
  }, [sessions, restLogs, refuels]);

  // Handlers
  const handleStartTrip = async () => {
    await startTrip(id);
    refetch();
    refetchSessions();
  };
  const handleCompleteTrip = async () => {
    const fuelLeft = prompt("Enter remaining fuel before completing trip:");
    if (!fuelLeft) return;
    await completeTrip({ id, fuel_left: Number(fuelLeft) });
    refetch();
    refetchSessions();
    refetchRestLogs();
    refetchRefuels();
  };
  const handleEndDriveSession = async (sessionId) => {
    const fuelLeft = prompt("Enter remaining fuel at end of drive session:");
    if (!fuelLeft) return;
    await endSession({ session_id: sessionId, fuel_left: Number(fuelLeft) });
    refetchSessions();
    refetchRestLogs();
    refetch();
  };
  const handleEndRest = async (restId) => {
    const fuelEnd = prompt("Enter fuel left at end of rest:");
    if (!fuelEnd) return;
    await endRest({ rest_id: restId, fuel_at_rest_end: Number(fuelEnd) });
    refetchRestLogs();
    refetchSessions();
    refetch();
  };
  const handleLogRefuel = async () => {
    const fuelBefore = prompt("Fuel before refuel (liters):");
    const fuelAdded = prompt("Fuel added (liters):");
    const payment_mode = prompt("Payment mode (cash/card/upi):", "cash");
    if (!fuelBefore || !fuelAdded) return;
    await logRefuel({
      trip_id: trip._id,
      event_time: new Date().toISOString(),
      fuel_before: Number(fuelBefore),
      fuel_added: Number(fuelAdded),
      payment_mode,
    });
    refetch();
    refetchRefuels();
  };

  if (!trip)
    return <div className="text-center py-5">Loading trip data...</div>;

  return (
    <Container>
      <Row className="mb-4">
        <Col md={7}>
          <Card>
            <Card.Header>
              <h4>
                <Badge bg="secondary" className="me-2">
                  Trip
                </Badge>
                {trip.start_city} <strong>→</strong> {trip.end_city}
              </h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col>
                  <span>Status: </span>
                  <Badge
                    bg={
                      trip.status === "scheduled"
                        ? "info"
                        : trip.status === "ongoing"
                        ? "primary"
                        : trip.status === "completed"
                        ? "success"
                        : "danger"
                    }
                  >
                    {trip.status}
                  </Badge>
                </Col>
                <Col>
                  Created: {moment(trip.createdAt).format("MMM DD YYYY, HH:mm")}
                </Col>
              </Row>
              <Row>
                <Col>
                  <div>
                    <strong>Total KM planned:</strong> {trip.total_km}
                  </div>
                  <div>
                    <strong>KM Remaining:</strong> {trip.remaining_km_in_trip}
                  </div>
                  <div>
                    <strong>Fuel Start:</strong> {trip.fuel_start}L
                  </div>
                  <div>
                    <strong>Fuel End:</strong> {trip.fuel_end ?? "-"}
                  </div>
                </Col>
                <Col>
                  <div>
                    <strong>Cargo Weight:</strong> {trip.cargo_weight}kg
                  </div>
                  {trip.truck_id && (
                    <div>
                      <strong>Truck:</strong> {trip.truck_id.plate_number}
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card>
            <Card.Header>
              <h5>
                <Badge bg="warning" text="dark">
                  Driver
                </Badge>
              </h5>
            </Card.Header>
            <Card.Body>
              {trip.driver_id ? (
                <>
                  <div>
                    <strong>Name:</strong> {trip.driver_id.name}
                  </div>
                  <div>
                    <strong>Phone:</strong> {trip.driver_id.phone}
                  </div>
                  <div>
                    <strong>Aadhaar:</strong>{" "}
                    {trip.driver_id.aadhar_number ?? "-"}
                  </div>
                  <div>
                    <strong>License:</strong>{" "}
                    {trip.driver_id.license_number ?? "-"}
                  </div>
                </>
              ) : (
                <div className="text-muted">No driver assigned</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Timeline */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Trip Timeline</h5>
        </Card.Header>
        <Card.Body>
          {timelineEvents.length === 0 ? (
            <div className="text-muted">No events yet.</div>
          ) : (
            <Table size="sm" striped bordered responsive>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timelineEvents.map((ev) => {
                  let actionButton = null;
                  let detailText = "";

                  // Show buttons only if logged-in user is assigned driver & trip ongoing
                  if (isDriver && trip.status === "ongoing") {
                    if (ev.type === "DriveSessionStart" && !ev.data.end_time) {
                      actionButton = (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleEndDriveSession(ev.data._id)}
                        >
                          End Drive Session
                        </Button>
                      );
                    }
                    if (ev.type === "RestStart" && !ev.data.rest_end_time) {
                      actionButton = (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEndRest(ev.data._id)}
                        >
                          End Rest & Resume Drive
                        </Button>
                      );
                    }
                  }

                  switch (ev.type) {
                    case "DriveSessionStart":
                      detailText = `Drive session started. Fuel used in session: ${
                        ev.data.fuel_used ?? "N/A"
                      }L`;
                      break;
                    case "DriveSessionEnd":
                      detailText = `Drive session ended. Fuel used: ${
                        ev.data.fuel_used ?? "N/A"
                      }L`;
                      break;
                    case "RestStart":
                      detailText = `Rest started. Fuel at start of rest: ${
                        ev.data.fuel_at_rest_start ?? "N/A"
                      }L`;
                      break;
                    case "RestEnd":
                      detailText = `Rest ended. Fuel at end of rest: ${
                        ev.data.fuel_at_rest_end ?? "N/A"
                      }L`;
                      break;
                    case "Refuel":
                      detailText = `Fuel before: ${ev.data.fuel_before}L, Added: ${ev.data.fuel_added}L, After: ${ev.data.fuel_after}L. Payment: ${ev.data.payment_mode}`;
                      break;
                    default:
                      detailText = "";
                  }

                  return (
                    <tr key={ev.id}>
                      <td>{moment(ev.time).format("MMM DD YYYY, HH:mm")}</td>
                      <td>{ev.label}</td>
                      <td>{detailText}</td>
                      <td>{actionButton}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Driver Action Buttons */}
      <Row>
        <Col>
          {isDriver && (
            <>
              {trip.status === "scheduled" && (
                <Button
                  variant="success"
                  onClick={handleStartTrip}
                  className="me-2"
                >
                  Start Trip
                </Button>
              )}
              {trip.status === "ongoing" && (
                <>
                  <Button
                    variant="warning"
                    onClick={handleCompleteTrip}
                    className="me-2"
                  >
                    Complete Trip
                  </Button>
                  <Button variant="info" onClick={handleLogRefuel}>
                    Log Refuel
                  </Button>
                </>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
