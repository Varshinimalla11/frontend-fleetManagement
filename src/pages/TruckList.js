"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Badge, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"

const TruckList = () => {
  const [trucks, setTrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [truckToDelete, setTruckToDelete] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchTrucks()
  }, [])

  const fetchTrucks = async () => {
    try {
      const response = await axios.get("/api/trucks")
      setTrucks(response.data)
    } catch (error) {
      console.error("Error fetching trucks:", error)
      toast.error("Error loading trucks")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (truck) => {
    setTruckToDelete(truck)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/trucks/${truckToDelete._id}`)
      setTrucks(trucks.filter((truck) => truck._id !== truckToDelete._id))
      toast.success("Truck deleted successfully")
    } catch (error) {
      console.error("Error deleting truck:", error)
      toast.error("Error deleting truck")
    } finally {
      setShowDeleteModal(false)
      setTruckToDelete(null)
    }
  }

   const getConditionBadge = (condition) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      maintenance_needed: "warning",
      in_maintenance: "info",
    }
    return <Badge bg={variants[condition] || "secondary"}>{condition}</Badge>
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
            <h1>Trucks</h1>
            {(user.role === "owner" || user.role === "admin") && (
              <Button as={Link} to="/trucks/new" variant="primary">
                <i className="fas fa-plus me-2"></i>
                Add New Truck
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {trucks.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                       <th>Plate Number</th>
                      <th>Condition</th>
                      <th>Mileage Factor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trucks.map((truck) => (
                      <tr key={truck._id}>
                         <td><strong>{truck.plate_number}</strong></td>
                        <td>{getConditionBadge(truck.condition)}</td>
                        <td>{truck.mileage_factor}</td>
                      <td>
                          <div className="btn-group" role="group">
                            <Button as={Link} to={`/trucks/${truck._id}`} variant="outline-primary" size="sm">
                              <i className="fas fa-eye"></i>
                            </Button>
                            {(user.role === "owner" || user.role === "admin") && (
                              <>
                                <Button
                                  as={Link}
                                  to={`/trucks/${truck._id}/edit`}
                                  variant="outline-secondary"
                                  size="sm"
                                >
                                  <i className="fas fa-edit"></i>
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(truck)}>
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-truck fa-3x text-muted mb-3"></i>
                  <h4>No trucks found</h4>
                  <p className="text-muted">Start by adding your first truck to the fleet.</p>
                  {(user.role === "owner" || user.role === "admin") && (
                    <Button as={Link} to="/trucks/new" variant="primary">
                      Add First Truck
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
          Are you sure you want to delete truck {truckToDelete?.plate_number}? This action cannot be undone.
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

export default TruckList
