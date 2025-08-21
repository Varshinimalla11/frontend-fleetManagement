"use client";

// src/components/TruckForm.jsx
import { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateTruckMutation,
  useUpdateTruckMutation,
  useGetTruckByIdQuery,
} from "../../api/trucksApi";
import { toast } from "react-toastify";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";

const TruckForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { refetch } = useGetDashboardStatsQuery(undefined, { skip: false });
  const [formData, setFormData] = useState({
    plate_number: "",
    condition: "",
    mileage_factor: "",
  });

  const { data: truck, isLoading: loadingTruck } = useGetTruckByIdQuery(id, {
    skip: !isEdit,
  });

  const [createTruck, { isLoading: creating }] = useCreateTruckMutation();
  const [updateTruck, { isLoading: updating }] = useUpdateTruckMutation();

  useEffect(() => {
    if (truck && isEdit) {
      setFormData({
        plate_number: truck.plate_number,
        condition: truck.condition,
        mileage_factor: truck.mileage_factor,
      });
    }
  }, [truck, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateTruck({ id, ...formData }).unwrap();
        toast.success("Truck updated successfully");
      } else {
        await createTruck(formData).unwrap();
        toast.success("Truck created successfully");
      }
      refetch();
      navigate("/trucks");
    } catch {
      toast.error("Error saving truck");
    }
  };

  if (loadingTruck)
    return (
      <div className="bg-primary bg-opacity-25 min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="bg-primary bg-opacity-25 min-vh-100 d-flex justify-content-center align-items-center p-3">
      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="mb-4 fw-bold text-center text-primary">
          <i className="fas fa-truck me-2"></i>
          {isEdit ? "Edit Truck" : "Add New Truck"}
        </h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formPlateNumber">
            <Form.Label className="fw-semibold text-muted">
              <i className="fas fa-id-card me-2"></i>
              Plate Number
            </Form.Label>
            <Form.Control
              type="text"
              name="plate_number"
              value={formData.plate_number}
              onChange={handleChange}
              required
              placeholder="Enter plate number"
              readOnly={isEdit}
              className="py-2 rounded-3"
              style={{ backgroundColor: isEdit ? "#f8f9fa" : "white" }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-muted">
              <i className="fas fa-cog me-2"></i>
              Condition
            </Form.Label>
            <Form.Control
              as="select"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              className="py-2 rounded-3"
            >
              <option value="">Select Condition</option>
              <option value="active">Active</option>
              <option value="maintenance_needed">Maintenance Needed</option>
              <option value="in_maintenance">In Maintenance</option>
              <option value="inactive">Inactive</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-muted">
              <i className="fas fa-tachometer-alt me-2"></i>
              Mileage Factor
            </Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              name="mileage_factor"
              value={formData.mileage_factor}
              onChange={handleChange}
              required
              placeholder="Enter mileage factor"
              className="py-2 rounded-3"
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={creating || updating}
              className="py-2 fw-semibold rounded-3"
              size="lg"
            >
              {creating || updating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Save Truck
                </>
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/trucks")}
              className="py-2 fw-semibold rounded-3"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default TruckForm;
