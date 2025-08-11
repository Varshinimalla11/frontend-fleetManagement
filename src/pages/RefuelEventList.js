"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from "react-bootstrap"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import moment from "moment"

const RefuelEventList = () => {
  const [refuelEvents, setRefuelEvents] = useState([])
  const [trucks, setTrucks] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    truck: "",
    trip: "",
    fuelAmount: "",
    cost: "",
    location: "",
    date: new Date().toISOString().slice(0, 16),
  })
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [refuelRes, trucksRes, tripsRes] = await Promise.all([
        axios.get("/api/refuel-events"),
        axios.get("/api/trucks"),
        axios.get("/api/trips"),
      ])

      setRefuelEvents(refuelRes.data)
      setTrucks(trucksRes.data)
      setTrips(tripsRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Error loading data")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const submitData = {
        ...formData,
        fuelAmount: Number.parseFloat(formData.fuelAmount),
        cost: Number.parseFloat(formData.cost),
        trip: formData.trip || null,
      }

      const response = await axios.post("/api/refuel-events", submitData)
      setRefuelEvents([response.data, ...refuelEvents])
      setShowModal(false)
      setFormData({
        truck: "",
        trip: "",
        fuelAmount: "",
        cost: "",
        location: "",
        date: new Date().toISOString().slice(0, 16),
      })
      toast.success("Refuel event logged successfully")
    } catch (error) {
      console.error("Error logging refuel event:", error)
      setError(error.response?.data?.message || "Error logging refuel event")
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Refuel Events</h1>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i>
              Log Refuel Event
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {refuelEvents.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Truck</th>
                      <th>Trip</th>
                      <th>Location</th>
                      <th>Fuel Amount</th>
                      <th>Cost</th>
                      <th>Logged By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refuelEvents.map((event) => (
                      <tr key={event._id}>
                        <td>{moment(event.date).format("MMM DD, YYYY HH:mm")}</td>
                        <td>{event.truck?.licensePlate || "Unknown"}</td>
                        <td>{event.trip ? `${event.trip.origin} → ${event.trip.destination}` : "No trip"}</td>
                        <td>{event.location}</td>
                        <td>{event.fuelAmount} L</td>
                        <td>${event.cost.toFixed(2)}</td>
                        <td>{event.loggedBy?.name || "Unknown"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-gas-pump fa-3x text-muted mb-3"></i>
                  <h4>No refuel events found</h4>
                  <p className="text-muted">Start by logging your first refuel event.</p>
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    Log First Refuel Event
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Refuel Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Log Refuel Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Truck *</Form.Label>
                  <Form.Select name="truck" value={formData.truck} onChange={handleChange} required>
                    <option value="">Select a truck</option>
                    {trucks.map((truck) => (
                      <option key={truck._id} value={truck._id}>
                        {truck.licensePlate} - {truck.make} {truck.model}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trip (Optional)</Form.Label>
                  <Form.Select name="trip" value={formData.trip} onChange={handleChange}>
                    <option value="">No trip associated</option>
                    {trips
                      .filter((trip) => trip.status === "active")
                      .map((trip) => (
                        <option key={trip._id} value={trip._id}>
                          {trip.origin} → {trip.destination}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fuel Amount (Liters) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="fuelAmount"
                    value={formData.fuelAmount}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 50.5"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cost ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 75.50"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location *</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Gas station name or address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date & Time *</Form.Label>
              <Form.Control type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Log Refuel Event
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default RefuelEventList
