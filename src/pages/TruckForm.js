"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const TruckForm = () => {
  const [formData, setFormData] = useState({
   plate_number: "",
    condition: "active",
    mileage_factor: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  useEffect(() => {
    if (isEdit) {
      fetchTruck()
    }
  }, [id])

  const fetchTruck = async () => {
    try {
      const response = await axios.get(`/api/trucks/${id}`)
      const truck = response.data
      setFormData({
         plate_number: truck.plate_number,
        condition: truck.condition,
        mileage_factor: truck.mileage_factor.toString(),
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
        plate_number: formData.plate_number,
        condition: formData.condition,
        mileage_factor: Number(formData.mileage_factor),
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
                  <Form.Label>Plate Number *</Form.Label>
                  <Form.Control
                     type="text"
                    name="plate_number"
                    value={formData.plate_number}
                    onChange={handleChange}
                    required
                    placeholder="Enter plate number"
                  />
                </Form.Group>

                  <Form.Group className="mb-3">
                  <Form.Label>Condition *</Form.Label>
                  <Form.Select name="condition" value={formData.condition} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="maintenance_needed">Maintenance Needed</option>
                    <option value="in_maintenance">In Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
                
                 <Form.Group className="mb-3">
                  <Form.Label>Mileage Factor *</Form.Label>
                  <Form.Control
                    type="number"
                    name="mileage_factor"
                    value={formData.mileage_factor}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1.2"
                  />
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
