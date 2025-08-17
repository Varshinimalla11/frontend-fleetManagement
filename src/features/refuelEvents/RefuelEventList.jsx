import { useParams } from "react-router-dom";
import {
  useGetRefuelEventsByTripQuery,
  useCreateRefuelEventMutation,
  useDeleteRefuelEventMutation,
} from "./refuelEventsApi";
import { Table, Button, Modal, Form, Row, Col, Spinner } from "react-bootstrap";
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
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      {/* Add Button */}
      <div className="mb-3">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Refuel Event
        </Button>
      </div>

      {/* Refuel Events Table */}
      <Table responsive bordered hover size="sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Fuel Before</th>
            <th>Fuel Added</th>
            <th>Fuel After</th>
            <th>Payment Mode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {refuels.map((event) => (
            <tr key={event._id}>
              <td>{moment(event.event_time).format("MMM DD, YYYY HH:mm")}</td>
              <td>{event.fuel_before} L</td>
              <td>{event.fuel_added} L</td>
              <td>{event.fuel_after} L</td>
              <td>{event.payment_mode}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setEventToDelete(event);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Refuel Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Refuel Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Event Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleFormChange}
                />
              </Col>
              <Col>
                <Form.Label>Fuel Before (L)</Form.Label>
                <Form.Control
                  type="number"
                  name="fuel_before"
                  value={formData.fuel_before}
                  onChange={handleFormChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Fuel Added (L)</Form.Label>
                <Form.Control
                  type="number"
                  name="fuel_added"
                  value={formData.fuel_added}
                  onChange={handleFormChange}
                />
              </Col>
              <Col>
                <Form.Label>Fuel After (L)</Form.Label>
                <Form.Control
                  type="number"
                  name="fuel_after"
                  value={formData.fuel_after}
                  onChange={handleFormChange}
                />
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Payment Mode</Form.Label>
              <Form.Control
                type="text"
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddRefuel}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Refuel Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this refuel event recorded on{" "}
          {moment(eventToDelete?.event_time).format("MMM DD, YYYY HH:mm")}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RefuelEventList;
