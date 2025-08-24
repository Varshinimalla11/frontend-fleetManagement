"use client";

import { useParams } from "react-router-dom";
import {
  useGetRefuelEventsByTripQuery,
  useCreateRefuelEventMutation,
  useDeleteRefuelEventMutation,
} from "../../api/refuelEventsApi";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
  Card,
  Badge,
} from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

const RefuelEventList = () => {
  const { tripId } = useParams();
  const {
    data: refuels = [],
    isLoading,
    refetch,
  } = useGetRefuelEventsByTripQuery(tripId);
  const [createRefuelEvent] = useCreateRefuelEventMutation();
  const [deleteRefuelEvent] = useDeleteRefuelEventMutation();

  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [formData, setFormData] = useState({
    event_time: "",
    fuel_before: "",
    fuel_added: "",
    fuel_after: "",
    payment_mode: "",
  });

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddRefuel = async () => {
    try {
      await createRefuelEvent({ ...formData, trip_id: tripId }).unwrap();
      toast.success("Refuel event added successfully");
      setShowForm(false);
      setFormData({
        event_time: "",
        fuel_before: "",
        fuel_added: "",
        fuel_after: "",
        payment_mode: "",
      });
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Error adding refuel event");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRefuelEvent(eventToDelete._id).unwrap();
      toast.success("Refuel event deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Error deleting refuel event");
    } finally {
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "400px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            variant="light"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-white mt-3 fs-5">Loading refuel events...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px 0",
      }}
    >
      <div className="container">
        <Card className="shadow-lg border-0 mb-4">
          <Card.Header
            className="text-white py-4"
            style={{
              background: "linear-gradient(135deg, #FF9800, #F57C00)",
              borderRadius: "0.5rem 0.5rem 0 0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold">
                <i className="fas fa-gas-pump me-3"></i>
                Refuel Events
                <Badge
                  bg="light"
                  text="dark"
                  className="ms-3 px-3 py-2 rounded-pill"
                >
                  {refuels.length} events
                </Badge>
              </h4>
              <Button
                variant="light"
                onClick={() => setShowForm(true)}
                className="fw-semibold px-4 rounded-pill"
                style={{
                  border: "none",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fas fa-plus me-2"></i>Add Refuel Event
              </Button>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {refuels.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-gas-pump fa-3x text-muted mb-3"></i>
                <p className="text-muted fs-5">No refuel events recorded</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-calendar me-2"></i>Date
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-tachometer-alt me-2"></i>Fuel Before
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-plus me-2"></i>Fuel Added
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-gas-pump me-2"></i>Fuel After
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-credit-card me-2"></i>Payment Mode
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-cogs me-2"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {refuels.map((event) => (
                    <tr
                      key={event._id}
                      style={{ borderLeft: "4px solid #FF9800" }}
                    >
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-clock me-2 text-primary"></i>
                          {moment(event.event_time).format(
                            "MMM DD, YYYY HH:mm"
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge bg="info" className="px-3 py-2 rounded-pill">
                          {event.fuel_before} L
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge bg="success" className="px-3 py-2 rounded-pill">
                          +{event.fuel_added} L
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge bg="primary" className="px-3 py-2 rounded-pill">
                          {event.fuel_after} L
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-money-bill-wave me-2 text-success"></i>
                          {event.payment_mode}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setEventToDelete(event);
                            setShowDeleteModal(true);
                          }}
                          className="px-3 rounded-pill fw-semibold"
                          style={{ transition: "all 0.3s ease" }}
                        >
                          <i className="fas fa-trash me-1"></i>Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>

      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #FF9800, #F57C00)",
            color: "white",
          }}
        >
          <Modal.Title className="fw-bold">
            <i className="fas fa-gas-pump me-2"></i>Add Refuel Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <Form>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-calendar-alt me-2 text-primary"></i>
                    Event Time
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="event_time"
                    value={formData.event_time}
                    onChange={handleFormChange}
                    className="rounded-pill px-4 py-2"
                    style={{ borderLeft: "4px solid #2196F3" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-tachometer-alt me-2 text-info"></i>Fuel
                    Before (L)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="fuel_before"
                    value={formData.fuel_before}
                    onChange={handleFormChange}
                    className="rounded-pill px-4 py-2"
                    style={{ borderLeft: "4px solid #17a2b8" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-plus me-2 text-success"></i>Fuel Added
                    (L)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="fuel_added"
                    value={formData.fuel_added}
                    onChange={handleFormChange}
                    className="rounded-pill px-4 py-2"
                    style={{ borderLeft: "4px solid #28a745" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="fas fa-gas-pump me-2 text-primary"></i>Fuel
                    After (L)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="fuel_after"
                    value={formData.fuel_after}
                    onChange={handleFormChange}
                    className="rounded-pill px-4 py-2"
                    style={{ borderLeft: "4px solid #007bff" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label className="fw-semibold text-dark">
                <i className="fas fa-credit-card me-2 text-warning"></i>Payment
                Mode
              </Form.Label>
              <Form.Control
                type="text"
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleFormChange}
                className="rounded-pill px-4 py-2"
                style={{ borderLeft: "4px solid #ffc107" }}
                placeholder="e.g., Cash, Card, UPI"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            onClick={() => setShowForm(false)}
            className="px-4 rounded-pill fw-semibold"
          >
            <i className="fas fa-times me-2"></i>Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddRefuel}
            className="px-4 rounded-pill fw-semibold"
            style={{
              background: "linear-gradient(135deg, #FF9800, #F57C00)",
              border: "none",
            }}
          >
            <i className="fas fa-plus me-2"></i>Add Event
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #dc3545, #c82333)",
            color: "white",
          }}
        >
          <Modal.Title className="fw-bold">
            <i className="fas fa-trash-alt me-2"></i>Delete Refuel Event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <p className="fs-5 mb-2">
              Are you sure you want to delete this refuel event?
            </p>
            <p className="text-muted">
              Recorded on{" "}
              {moment(eventToDelete?.event_time).format("MMM DD, YYYY HH:mm")}
            </p>
            <small className="text-muted">This action cannot be undone.</small>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            className="px-4 rounded-pill fw-semibold"
          >
            <i className="fas fa-times me-2"></i>Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="px-4 rounded-pill fw-semibold"
            style={{
              background: "linear-gradient(135deg, #dc3545, #c82333)",
              border: "none",
            }}
          >
            <i className="fas fa-trash me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RefuelEventList;
