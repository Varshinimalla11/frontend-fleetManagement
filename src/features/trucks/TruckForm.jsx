// src/components/TruckForm.jsx
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateTruckMutation,
  useUpdateTruckMutation,
  useGetTruckByIdQuery,
} from "../../api/trucksApi";
import { toast } from "react-toastify";

const TruckForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

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
      navigate("/trucks");
    } catch {
      toast.error("Error saving truck");
    }
  };

  if (loadingTruck) return <Spinner animation="border" />;

  return (
    <Container className="mt-4">
      <h1>{isEdit ? "Edit Truck" : "Add New Truck"}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Plate Number</Form.Label>
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
          <Form.Label>Condition</Form.Label>
          <Form.Control
            as="select"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          >
            <option value="">Select Condition</option>
            <option value="active">active</option>
            <option value="maintenance_needed">maintenance_needed</option>
            <option value="in_maintenance">in_maintenance</option>
            <option value="inactive">inactive</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mileage Factor</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            name="mileage_factor"
            value={formData.mileage_factor}
            onChange={handleChange}
            required
            placeholder="Enter mileage factor"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={creating || updating}>
          {creating || updating ? "Saving..." : "Save"}
        </Button>
      </Form>
    </Container>
  );
};

export default TruckForm;
