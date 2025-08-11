"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Badge, Button, Table } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import moment from "moment"

const TripDetails = () => {
  const [trip, setTrip] = useState(null)
  const [driveSessions, setDriveSessions] = useState([])
  const [refuelEvents, setRefuelEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTripDetails()
  }, [id])

  const fetchTripDetails = async () => {
    try {
      const [tripRes, driveSessionsRes, refuelEventsRes] = await Promise.all([
        axios.get(`/api/trips/${id}`),
        axios.get(`/api/drive-sessions?trip=${id}`),
        axios.get(`/api/refuel-events?trip=${id}`),
      ])

      setTrip(tripRes.data)
      setDriveSessions(driveSessionsRes.data)
      setRefuelEvents(refuelEventsRes.data)
    } catch (error) {
      console.error("Error fetching trip details:", error)
      toast.error("Error loading trip details")
      navigate("/trips")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      planned: "secondary",
      active: "primary",
      completed: "success",
      cancelled: "danger",
    }
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>
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

  if (!trip) {
    return (
      <Container>
        <div className="text-center mt-5">
          <h4>Trip not found</h4>
          <Button variant="primary" onClick={() => navigate("/trips")}>
            Back to Trips
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Trip Details</h1>
            <Button variant="secondary" onClick={() => navigate("/trips")}>
              <i className="fas fa-arrow-left me-2"></i>
              Back to Trips
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
                    <strong>Origin:</strong> {trip.origin}
                  </p>
                  <p>
                    <strong>Destination:</strong> {trip.destination}
                  </p>
                  <p>
                    <strong>Status:</strong> {getStatusBadge(trip.status)}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Start Date:</strong> {moment(trip.startDate).format("MMM DD, YYYY HH:mm")}
                  </p>
                  {trip.endDate && (
                    <p>
                      <strong>End Date:</strong> {moment(trip.endDate).format("MMM DD, YYYY HH:mm")}
                    </p>
                  )}
                  <p>
                    <strong>Created:</strong> {moment(trip.createdAt).format("MMM DD, YYYY")}
                  </p>
                </Col>
              </Row>
              {trip.notes && (
                <div className="mt-3">
                  <strong>Notes:</strong>
                  <p className="mt-1">{trip.notes}</p>
                </div>
              )}
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
                        <td>{moment(session.startTime).format("MMM DD, HH:mm")}</td>
                        <td>{session.endTime ? moment(session.endTime).format("MMM DD, HH:mm") : "Ongoing"}</td>
                        <td>
                          {session.endTime
                            ? moment.duration(moment(session.endTime).diff(moment(session.startTime))).humanize()
                            : "Ongoing"}
                        </td>
                        <td>
                          <Badge bg={session.status === "active" ? "success" : "secondary"}>{session.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No drive sessions recorded for this trip.</p>
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
                <p className="text-muted">No refuel events recorded for this trip.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Assigned Resources */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Assigned Resources</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Truck:</strong>
                {trip.truck ? (
                  <div className="mt-1">
                    <p className="mb-1">{trip.truck.licensePlate}</p>
                    <small className="text-muted">
                      {trip.truck.make} {trip.truck.model} ({trip.truck.year})
                    </small>
                  </div>
                ) : (
                  <p className="text-muted mt-1">No truck assigned</p>
                )}
              </div>

              <div>
                <strong>Driver:</strong>
                {trip.driver ? (
                  <div className="mt-1">
                    <p className="mb-1">{trip.driver.name}</p>
                    <small className="text-muted">{trip.driver.email}</small>
                  </div>
                ) : (
                  <p className="text-muted mt-1">No driver assigned</p>
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
              <div className="mb-2">
                <strong>Total Drive Sessions:</strong>
                <span className="float-end">{driveSessions.length}</span>
              </div>
              <div className="mb-2">
                <strong>Total Refuel Events:</strong>
                <span className="float-end">{refuelEvents.length}</span>
              </div>
              <div className="mb-2">
                <strong>Total Fuel Cost:</strong>
                <span className="float-end">
                  ${refuelEvents.reduce((total, event) => total + event.cost, 0).toFixed(2)}
                </span>
              </div>
              <div>
                <strong>Total Fuel Amount:</strong>
                <span className="float-end">
                  {refuelEvents.reduce((total, event) => total + event.fuelAmount, 0).toFixed(1)} L
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default TripDetails
