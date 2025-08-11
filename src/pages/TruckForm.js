"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const TruckForm = () => {
  const [formData, setFormData] = useState({
    licensePlate: "",
    make: "",
    model: "",
    year: "",
    status: "active",
    currentDriver: "",
  })
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  useEffect(() => {
    fetchDrivers()
    if (isEdit) {
      fetchTruck()
    }
  }, [id])

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("/api/users?role=driver")
      setDrivers(response.data)
    } catch (error) {
      console.error("Error fetching drivers:", error)
    }
  }

  const fetchTruck = async () => {
    try {
      const response = await axios.get(`/api/trucks/${id}`)
      const truck = response.data
      setFormData({
        licensePlate: truck.licensePlate,
        make: truck.make,
        model: truck.model,
        year: truck.year.toString(),
        status: truck.status,
        currentDriver: truck.currentDriver?._id || "",
      })
    } catch (error) {
      console.error("Error fetching truck:", error)
      toast.error("Error loading truck data")
      navigate("/trucks")
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
        year: Number.parseInt(formData.year),
        currentDriver: formData.currentDriver || null,
      }

      if (isEdit) {
        await axios.put(`/api/trucks/${id}`, submitData)
        toast.success("Truck updated successfully")
      } else {
        await axios.post("/api/trucks", submitData)
        toast.success("Truck created successfully")
      }

      navigate("/trucks")
    } catch (error) {
      console.error("Error saving truck:", error)
      setError(error.response?.data?.message || "Error saving truck")
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
              <h3>{isEdit ? "Edit Truck" : "Add New Truck"}</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>License Plate *</Form.Label>
                  <Form.Control
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    required
                    placeholder="Enter license plate"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Make *</Form.Label>
                      <Form.Control
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Ford"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Model *</Form.Label>
                      <Form.Control
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        placeholder="e.g., F-150"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year *</Form.Label>
                      <Form.Control
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        placeholder="e.g., 2020"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Current Driver</Form.Label>
                  <Form.Select name="currentDriver" value={formData.currentDriver} onChange={handleChange}>
                    <option value="">Unassigned</option>
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" disabled={loading} className="flex-grow-1">
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isEdit ? "Updating..." : "Creating..."}
                      </>
                    ) : isEdit ? (
                      "Update Truck"
                    ) : (
                      "Create Truck"
                    )}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/trucks")}>
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

export default TruckForm
