"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Badge, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import moment from "moment"

const TripList = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tripToDelete, setTripToDelete] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/api/trips")
      setTrips(response.data)
    } catch (error) {
      console.error("Error fetching trips:", error)
      toast.error("Error loading trips")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/trips/${tripToDelete._id}`)
      setTrips(trips.filter((trip) => trip._id !== tripToDelete._id))
      toast.success("Trip deleted successfully")
    } catch (error) {
      console.error("Error deleting trip:", error)
      toast.error("Error deleting trip")
    } finally {
      setShowDeleteModal(false)
      setTripToDelete(null)
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

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Trips</h1>
            {(user.role === "owner" || user.role === "admin") && (
              <Button as={Link} to="/trips/new" variant="primary">
                <i className="fas fa-plus me-2"></i>
                Create New Trip
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {trips.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Truck</th>
                      <th>Driver</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip._id}>
                        <td>{trip.origin}</td>
                        <td>{trip.destination}</td>
                        <td>{trip.truck ? trip.truck.licensePlate : "Unassigned"}</td>
                        <td>{trip.driver ? trip.driver.name : "Unassigned"}</td>
                        <td>{moment(trip.startDate).format("MMM DD, YYYY")}</td>
                        <td>{getStatusBadge(trip.status)}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button as={Link} to={`/trips/${trip._id}`} variant="outline-primary" size="sm">
                              <i className="fas fa-eye"></i>
                            </Button>
                            {(user.role === "owner" || user.role === "admin") && (
                              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(trip)}>
                                <i className="fas fa-trash"></i>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-route fa-3x text-muted mb-3"></i>
                  <h4>No trips found</h4>
                  <p className="text-muted">Start by creating your first trip.</p>
                  {(user.role === "owner" || user.role === "admin") && (
                    <Button as={Link} to="/trips/new" variant="primary">
                      Create First Trip
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this trip from {tripToDelete?.origin} to {tripToDelete?.destination}? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default TripList
