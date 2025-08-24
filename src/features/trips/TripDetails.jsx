"use client";

import { useMemo, useState } from "react";
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
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRoute,
  faMapMarkerAlt,
  faRoad,
  faWeightHanging,
  faTruck,
  faUser,
  faPhone,
  faIdCard,
  faIdBadge,
  faHistory,
  faClock,
  faFlag,
  faInfo,
  faCogs,
  faStop,
  faPlay,
  faFlagCheckered,
  faGasPump,
  faCheck,
  faTimes,
  faCalendar,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
export default function TripDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: trip, refetch: refetchTrip } = useGetTripByIdQuery(id, {
    pollingInterval: 6000,
  });

  const { data: sessions = [], refetch: refetchSessions } =
    useGetSessionsByTripQuery(id, { pollingInterval: 6000 });

  const { data: restLogs = [], refetch: refetchRestLogs } =
    useGetRestLogsByTripQuery(id, { pollingInterval: 6000 });

  const { data: refuels = [], refetch: refetchRefuels } =
    useGetRefuelLogsByTripQuery(id, { pollingInterval: 6000 });

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

  const [showModal, setShowModal] = useState(false);
  const [modalInputs, setModalInputs] = useState({});
  const [modalAction, setModalAction] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  const openModal = (action, id = null) => {
    setModalAction(action);
    setCurrentId(id);
    setModalInputs({});
    setShowModal(true);
  };

  const handleModalInputChange = (e) => {
    setModalInputs({
      ...modalInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleModalSubmit = async () => {
    try {
      if (modalAction === "completeTrip") {
        if (!modalInputs.fuelLeft)
          return alert("Please enter remaining fuel before completing trip");
        await completeTrip({ id, fuel_left: Number(modalInputs.fuelLeft) });
      } else if (modalAction === "endDriveSession") {
        if (!modalInputs.fuelLeft)
          return alert("Please enter remaining fuel at end of drive session");
        await endSession({
          session_id: currentId,
          fuel_left: Number(modalInputs.fuelLeft),
        });
      } else if (modalAction === "endRest") {
        if (!modalInputs.fuelEnd)
          return alert("Please enter fuel left at end of rest");
        await endRest({
          rest_id: currentId,
          fuel_at_rest_end: Number(modalInputs.fuelEnd),
        });
      } else if (modalAction === "logRefuel") {
        if (!modalInputs.fuelBefore || !modalInputs.fuelAdded)
          return alert("Please enter fuel amounts");
        await logRefuel({
          trip_id: trip._id,
          event_time: new Date().toISOString(),
          fuel_before: Number(modalInputs.fuelBefore),
          fuel_added: Number(modalInputs.fuelAdded),
          payment_mode: modalInputs.paymentMode || "cash",
        });
      }

      // Refetch after action complete
      await refetchTrip();
      await refetchSessions();
      await refetchRestLogs();
      await refetchRefuels();
      await refetchNotifications();

      setShowModal(false);
    } catch (err) {
      alert("Error submitting data. Please try again.");
    }
  };
  // Handlers
  const handleStartTrip = async () => {
    await startTrip(id);
    refetchTrip();
    refetchSessions();
    refetchRestLogs();
    refetchRefuels();
    refetchNotifications();
  };
  // Replace old prompt handlers with openModal calls
  const handleCompleteTrip = () => openModal("completeTrip");
  const handleEndDriveSession = (sessionId) =>
    openModal("endDriveSession", sessionId);
  const handleEndRest = (restId) => openModal("endRest", restId);
  const handleLogRefuel = () => openModal("logRefuel");
  if (!trip)
    return <div className="text-center py-5">Loading trip data...</div>;

  return (
    <>
      <div
        style={{
          backgroundColor: "#9faaf4",
          minHeight: "100vh",
          width: "100%",
          padding: 0,
          margin: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "2rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
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
          <Row className="mb-4">
            <Col md={7}>
              <Card className="shadow-sm border-0">
                <Card.Header
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <h4 className="mb-0 fw-bold">
                    <Badge bg="light" text="dark" className="me-2">
                      <FontAwesomeIcon icon={faRoute} className="me-1" />
                      Trip
                    </Badge>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="me-2 text-warning"
                    />
                    {trip.start_city} <strong>→</strong> {trip.end_city}
                  </h4>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="mb-3">
                    <Col>
                      <span className="fw-semibold">Status: </span>
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
                        className="px-3 py-2 fs-6"
                      >
                        <FontAwesomeIcon
                          icon={
                            trip.status === "scheduled"
                              ? faClock
                              : trip.status === "ongoing"
                              ? faPlay
                              : trip.status === "completed"
                              ? faCheck
                              : faTimes
                          }
                          className="me-1"
                        />
                        {trip.status}
                      </Badge>
                    </Col>
                    <Col>
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="text-muted me-1"
                      />
                      <span className="text-muted">Created: </span>
                      {moment(trip.createdAt).format("MMM DD YYYY, HH:mm")}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="mb-2">
                        <FontAwesomeIcon
                          icon={faRoad}
                          className="text-info me-2"
                        />
                        <strong>Total KM planned:</strong> {trip.total_km}
                      </div>
                      <div className="mb-2">
                        <FontAwesomeIcon
                          icon={faRoute}
                          className="text-warning me-2"
                        />
                        <strong>KM Remaining:</strong>{" "}
                        {trip.remaining_km_in_trip}
                      </div>
                      <div className="mb-2">
                        <FontAwesomeIcon
                          icon={faGasPump}
                          className="text-success me-2"
                        />
                        <strong>Fuel Start:</strong> {trip.fuel_start}L
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faGasPump}
                          className="text-danger me-2"
                        />
                        <strong>Fuel End:</strong> {trip.fuel_end ?? "-"}
                      </div>
                    </Col>
                    <Col>
                      <div className="mb-2">
                        <FontAwesomeIcon
                          icon={faWeightHanging}
                          className="text-primary me-2"
                        />
                        <strong>Cargo Weight:</strong> {trip.cargo_weight}kg
                      </div>
                      {trip.truck_id && (
                        <div>
                          <FontAwesomeIcon
                            icon={faTruck}
                            className="text-info me-2"
                          />
                          <strong>Truck:</strong> {trip.truck_id.plate_number}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card className="shadow-sm border-0">
                <Card.Header
                  style={{
                    background:
                      "linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)",
                    color: "white",
                  }}
                >
                  <h5 className="mb-0 fw-bold">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Driver Information
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {trip.driver_id ? (
                    <>
                      <div className="mb-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-primary me-2"
                        />
                        <strong>Name:</strong> {trip.driver_id.name}
                      </div>
                      <div className="mb-2">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="text-success me-2"
                        />
                        <strong>Phone:</strong> {trip.driver_id.phone}
                      </div>
                      <div className="mb-2">
                        <FontAwesomeIcon
                          icon={faIdCard}
                          className="text-info me-2"
                        />
                        <strong>Aadhaar:</strong>{" "}
                        {trip.driver_id.aadhar_number ?? "-"}
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faIdBadge}
                          className="text-warning me-2"
                        />
                        <strong>License:</strong>{" "}
                        {trip.driver_id.license_number ?? "-"}
                      </div>
                    </>
                  ) : (
                    <div className="text-muted text-center py-3">
                      <FontAwesomeIcon
                        icon={faUserSlash}
                        className="fa-2x mb-2"
                        style={{ opacity: 0.3 }}
                      />
                      <div>No driver assigned</div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Timeline */}
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                color: "white",
              }}
            >
              <h5 className="mb-0 fw-bold">
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Trip Timeline
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {timelineEvents.length === 0 ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="fa-3x text-muted mb-3"
                    style={{ opacity: 0.3 }}
                  />
                  <div className="text-muted">No events yet.</div>
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead
                    style={{
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                    }}
                  >
                    <tr>
                      <th className="fw-semibold">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="text-primary me-1"
                        />
                        Time
                      </th>
                      <th className="fw-semibold">
                        <FontAwesomeIcon
                          icon={faFlag}
                          className="text-success me-1"
                        />
                        Event
                      </th>
                      <th className="fw-semibold">
                        <FontAwesomeIcon
                          icon={faInfo}
                          className="text-info me-1"
                        />
                        Details
                      </th>
                      <th className="fw-semibold">
                        <FontAwesomeIcon
                          icon={faCogs}
                          className="text-warning me-1"
                        />
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timelineEvents.map((ev) => {
                      let actionButton = null;
                      let detailText = "";

                      // Show buttons only if logged-in user is assigned driver & trip ongoing
                      if (isDriver && trip.status === "ongoing") {
                        if (
                          ev.type === "DriveSessionStart" &&
                          !ev.data.end_time
                        ) {
                          actionButton = (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleEndDriveSession(ev.data._id)}
                              className="fw-semibold"
                            >
                              <FontAwesomeIcon icon={faStop} className="me-1" />
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
                              className="fw-semibold"
                            >
                              <FontAwesomeIcon icon={faPlay} className="me-1" />
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
                          <td>
                            {moment(ev.time).format("MMM DD YYYY, HH:mm")}
                          </td>
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
                <div className="text-center">
                  {trip.status === "scheduled" && (
                    <Button
                      variant="success"
                      onClick={handleStartTrip}
                      className="me-3 px-4 py-2 fw-semibold"
                      style={{
                        background: "linear-gradient(45deg, #28a745, #20c997)",
                        border: "none",
                      }}
                    >
                      <FontAwesomeIcon icon={faPlay} className="me-2" />
                      Start Trip
                    </Button>
                  )}
                  {trip.status === "ongoing" && (
                    <>
                      <Button
                        variant="warning"
                        onClick={handleCompleteTrip}
                        className="me-3 px-4 py-2 fw-semibold"
                        style={{
                          background:
                            "linear-gradient(45deg, #ffc107, #ff8c00)",
                          border: "none",
                          color: "white",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faFlagCheckered}
                          className="me-2"
                        />
                        Complete Trip
                      </Button>
                      <Button
                        variant="info"
                        onClick={handleLogRefuel}
                        className="px-4 py-2 fw-semibold"
                        style={{
                          background:
                            "linear-gradient(45deg, #17a2b8, #138496)",
                          border: "none",
                        }}
                      >
                        <FontAwesomeIcon icon={faGasPump} className="me-2" />
                        Log Refuel
                      </Button>
                    </>
                  )}
                </div>
              )}
              {/* Owner action buttons for test */}
              {/* {user?.role === "owner" && (
                <div className="text-center mt-3">
                  <Button variant="primary" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger">Delete</Button>
                </div>
              )} */}
            </Col>
          </Row>
        </div>
      </div>
      {/* Modal for inputs */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === "completeTrip" && "Complete Trip"}
            {modalAction === "endDriveSession" && "End Drive Session"}
            {modalAction === "endRest" && "End Rest & Resume Drive"}
            {modalAction === "logRefuel" && "Log Refuel Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {(modalAction === "completeTrip" ||
              modalAction === "endDriveSession") && (
              <Form.Group className="mb-3" controlId="fuelLeft">
                <Form.Label>Fuel Left (liters)</Form.Label>
                <Form.Control
                  type="number"
                  name="fuelLeft"
                  value={modalInputs.fuelLeft || ""}
                  onChange={handleModalInputChange}
                  autoFocus
                  min={0}
                />
              </Form.Group>
            )}

            {modalAction === "endRest" && (
              <Form.Group className="mb-3" controlId="fuelEnd">
                <Form.Label>Fuel Left at End of Rest (liters)</Form.Label>
                <Form.Control
                  type="number"
                  name="fuelEnd"
                  value={modalInputs.fuelEnd || ""}
                  onChange={handleModalInputChange}
                  autoFocus
                  min={0}
                />
              </Form.Group>
            )}

            {modalAction === "logRefuel" && (
              <>
                <Form.Group className="mb-3" controlId="fuelBefore">
                  <Form.Label>Fuel Before (liters)</Form.Label>
                  <Form.Control
                    type="number"
                    name="fuelBefore"
                    value={modalInputs.fuelBefore || ""}
                    onChange={handleModalInputChange}
                    autoFocus
                    min={0}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fuelAdded">
                  <Form.Label>Fuel Added (liters)</Form.Label>
                  <Form.Control
                    type="number"
                    name="fuelAdded"
                    value={modalInputs.fuelAdded || ""}
                    onChange={handleModalInputChange}
                    min={0}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="paymentMode">
                  <Form.Label>Payment Mode</Form.Label>
                  <Form.Select
                    name="paymentMode"
                    value={modalInputs.paymentMode || "cash"}
                    onChange={handleModalInputChange}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
