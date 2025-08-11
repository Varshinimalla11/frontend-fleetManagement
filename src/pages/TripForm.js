"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const TripForm = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    truck: "",
    driver: "",
    startDate: "",
    endDate: "",
    status: "planned",
    notes: "",
  })
  const [trucks, setTrucks] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchTrucksAndDrivers()
  }, [])

  const fetchTrucksAndDrivers = async () => {
    try {
      const [trucksRes, driversRes] = await Promise.all([axios.get("/api/trucks"), axios.get("/api/users?role=driver")])
      setTrucks(trucksRes.data)
      setDrivers(driversRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Error loading form data")
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
    setLoading(true)
    setError("")

    try {
      const submitData = {
        ...formData,
        truck: formData.truck || null,
        driver: formData.driver || null,
      }

      await axios.post("/api/trips", submitData)
      toast.success("Trip created successfully")
      navigate("/trips")
    } catch (error) {
      console.error("Error creating trip:", error)
      setError(error.response?.data?.message || "Error creating trip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header>
              <h3>Create New Trip</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Origin *</Form.Label>
                      <Form.Control
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        required
                        placeholder="Starting location"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Destination *</Form.Label>
                      <Form.Control
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        placeholder="Destination location"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Truck</Form.Label>
                      <Form.Select name="truck" value={formData.truck} onChange={handleChange}>
                        <option value="">Select a truck</option>
                        {trucks
                          .filter((truck) => truck.status === "active")
                          .map((truck) => (
                            <option key={truck._id} value={truck._id}>
                              {truck.licensePlate} - {truck.make} {truck.model}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Driver</Form.Label>
                      <Form.Select name="driver" value={formData.driver} onChange={handleChange}>
                        <option value="">Select a driver</option>
                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes about the trip"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" disabled={loading} className="flex-grow-1">
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Trip"
                    )}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/trips")}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default TripForm
