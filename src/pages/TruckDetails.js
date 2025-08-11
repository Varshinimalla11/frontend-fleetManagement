"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Container, Card, Button, Badge, Spinner, Row, Col } from "react-bootstrap"
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth } from "../contexts/AuthContext"

const TruckDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [truck, setTruck] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const response = await axios.get(`/api/trucks/${id}`)
        setTruck(response.data)
      } catch (error) {
        console.error("Error fetching truck details:", error)
        toast.error("Could not load truck details")
        navigate("/trucks")
      } finally {
        setLoading(false)
      }
    }
    fetchTruck()
  }, [id, navigate])

   const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this truck?")) return
    try {
      await axios.delete(`/api/trucks/${id}`)
      toast.success("Truck deleted successfully")
      navigate("/trucks")
    } catch (error) {
      console.error("Error deleting truck:", error)
      toast.error("Could not delete truck")
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      good: "success",
      fair: "warning",
      poor: "danger",
    }
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" />
      </Container>
    )
  }

  if (!truck) {
    return (
      <Container>
        <h3>Truck not found</h3>
        <Button as={Link} to="/trucks" variant="secondary">Back to Trucks</Button>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Truck Details</h1>
        </Col>
        <Col className="text-end">
          <Button as={Link} to="/trucks" variant="secondary" className="me-2">
            Back to List
          </Button>
          {(user.role === "owner" || user.role === "admin") && (
            <>
            <Button as={Link} to={`/trucks/${truck._id}/edit`} variant="primary">
              Edit Truck
            </Button>
            <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              </>
          )}
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Plate Number:</strong> {truck.plate_number}</p>
              <p><strong>Condition:</strong> {getStatusBadge(truck.condition)}</p>
              <p><strong>Mileage Factor:</strong> {truck.mileage_factor}</p>
          </Col>
          <Col md={6}>
  <p><strong>Current Driver:</strong> {truck.currentDriver ? truck.currentDriver.name : "Unassigned"}</p>
  {truck.createdAt && (
    <p>
      <strong>Created At:</strong>{" "}
      {new Date(truck.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  )}
</Col>

          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TruckDetails
