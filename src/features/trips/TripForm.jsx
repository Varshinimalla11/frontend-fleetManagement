"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateTripMutation,
  useUpdateTripMutation,
  useGetTripByIdQuery,
} from "../../api/tripsApi";
import { toast } from "react-toastify";
import { useGetDriversQuery } from "../../api/authApi";
// import { useGetTrucksQuery } from "../dashboard/dashboardApi";
import { useGetTrucksQuery } from "../../api/trucksApi";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TripForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { data: trucks = [], isLoading: loadingTrucks } = useGetTrucksQuery();
  const { data: drivers = [], isLoading: loadingDrivers } =
    useGetDriversQuery();

  const { data: trip, isLoading: loadingTrip } = useGetTripByIdQuery(id, {
    skip: !isEdit,
  });

  const [createTrip, { isLoading: creating }] = useCreateTripMutation();
  const [updateTrip, { isLoading: updating }] = useUpdateTripMutation();

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    truck: "",
    driver: "",
    startDate: "",
    endDate: "",
    totalKm: "",
    cargoWeight: "",
    fuelStart: "",
    status: "scheduled",
  });

  const [error, setError] = useState("");
  const { refetch } = useGetDashboardStatsQuery(undefined, { skip: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && trip) {
      setFormData({
        origin: trip.start_city,
        destination: trip.end_city,
        truck: trip.truck_id?._id || "",
        driver: trip.driver_id?._id || "",
        startDate: trip.start_time ? trip.start_time.slice(0, 16) : "",
        endDate: trip.end_time ? trip.end_time.slice(0, 16) : "",
        totalKm: trip.total_km,
        cargoWeight: trip.cargo_weight,
        fuelStart: trip.fuel_start,
        status: trip.status || "scheduled",
      });
    }
  }, [isEdit, trip]);

  const selectedDriverDetails = drivers.find((d) => d._id === formData.driver);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.driver) {
      setError("Please select a driver");
      return;
    }

    if (
      formData.origin.trim().toLowerCase() ===
      formData.destination.trim().toLowerCase()
    ) {
      const errorMessage = "Origin and Destination cannot be the same";
      setError(errorMessage);
      toast.error(errorMessage); // show toast error
      return; // stop form submission
    }

    try {
      const selectedDriver = drivers.find((d) => d._id === formData.driver);

      const submitData = {
        truck_id: formData.truck,
        driver_id: formData.driver,
        driver_snapshot: {
          name: selectedDriver.name,
          phone: selectedDriver.phone,
          aadhar_number: selectedDriver.aadhar_number,
          license_number: selectedDriver.license_number,
        },
        start_city: formData.origin,
        end_city: formData.destination,
        total_km: formData.totalKm,
        cargo_weight: formData.cargoWeight,
        fuel_start: formData.fuelStart,
        start_time: formData.startDate,
        end_time: formData.endDate || null,
        status: formData.status,
      };

      if (isEdit) {
        await updateTrip({ id, ...submitData }).unwrap();
        toast.success("Trip updated successfully");
        refetch();

        navigate(`/trips/${id}`);
      } else {
        await createTrip(submitData).unwrap();
        toast.success("Trip created successfully");
        refetch();
        navigate("/trips");
      }
    } catch (err) {
      setError(err.data?.message || "Error creating trip");
    }
  };

  if (loadingTrucks || loadingDrivers || (isEdit && loadingTrip)) {
    return (
      <div
        style={{
          backgroundColor: "#9faaf4",
          minHeight: "100vh",
          width: "100vw",
          padding: 0,
          margin: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  // if (trucksError || driversError) {
  //   return (
  //     <Container className="py-5 text-center">
  //       <Alert variant="danger">
  //         {trucksError?.data?.message ||
  //           driversError?.data?.message ||
  //           "Error loading form data"}
  //       </Alert>
  //     </Container>
  //   );
  // }

  return (
    <div
      style={{
        backgroundColor: "#9faaf4",
        minHeight: "100vh",
        width: "100%",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        paddingTop: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px #0002",
          padding: "2rem",
          boxSizing: "border-box",
          margin: "0 auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-2">
            <i
              className={`fas ${isEdit ? "fa-edit" : "fa-plus-circle"} me-2`}
            ></i>
            {isEdit ? "Edit Trip" : "Create New Trip"}
          </h2>
          <p className="text-muted">
            {isEdit
              ? "Update trip information below"
              : "Fill in the details to create a new trip"}
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-map-marker-alt text-primary me-1"></i>
                  Origin *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                  placeholder="Starting location"
                  className="form-control-lg"
                  style={{ borderLeft: "4px solid #007bff" }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-flag-checkered text-success me-1"></i>
                  Destination *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="Destination location"
                  className="form-control-lg"
                  style={{ borderLeft: "4px solid #28a745" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-truck text-info me-1"></i>
                  Truck
                </Form.Label>
                <Form.Select
                  name="truck"
                  value={formData.truck}
                  onChange={handleChange}
                  className="form-select-lg"
                  style={{ borderLeft: "4px solid #17a2b8" }}
                >
                  <option value="">Select a truck</option>
                  {trucks
                    .filter((truck) => truck.condition === "active")
                    .map((truck) => (
                      <option key={truck._id} value={truck._id}>
                        {truck.plate_number} - {truck.condition}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-user text-warning me-1"></i>
                  Driver *
                </Form.Label>
                <Form.Select
                  name="driver"
                  value={formData.driver}
                  onChange={handleChange}
                  required
                  className="form-select-lg"
                  style={{ borderLeft: "4px solid #ffc107" }}
                >
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

          {selectedDriverDetails && (
            <div className="d-flex justify-content-center mb-4">
              <Card
                className="p-3 shadow-sm border-0"
                style={{
                  maxWidth: "400px",
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  borderLeft: "4px solid #ffc107",
                }}
              >
                <div className="text-center">
                  <h5 className="text-primary mb-3">
                    <i className="fas fa-id-card me-2"></i>
                    Driver Information
                  </h5>
                  <div className="text-start">
                    <p className="mb-2">
                      <strong>
                        <i className="fas fa-user me-1 text-primary"></i>Name:
                      </strong>{" "}
                      {selectedDriverDetails.name}
                    </p>
                    <p className="mb-2">
                      <strong>
                        <i className="fas fa-phone me-1 text-success"></i>Phone:
                      </strong>{" "}
                      {selectedDriverDetails.phone}
                    </p>
                    <p className="mb-2">
                      <strong>
                        <i className="fas fa-id-card me-1 text-info"></i>
                        Aadhaar:
                      </strong>{" "}
                      {selectedDriverDetails.aadhar_number}
                    </p>
                    <p className="mb-0">
                      <strong>
                        <i className="fas fa-id-badge me-1 text-warning"></i>
                        License:
                      </strong>{" "}
                      {selectedDriverDetails.license_number}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-calendar-alt text-primary me-1"></i>
                  Start Date *
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  style={{ borderLeft: "4px solid #007bff" }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-calendar-check text-success me-1"></i>
                  End Date
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-control-lg"
                  style={{ borderLeft: "4px solid #28a745" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-road text-info me-1"></i>
                  Total KM *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="totalKm"
                  value={formData.totalKm}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  style={{ borderLeft: "4px solid #17a2b8" }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-weight-hanging text-warning me-1"></i>
                  Cargo Weight (kg) *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="cargoWeight"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  style={{ borderLeft: "4px solid #ffc107" }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-gas-pump text-danger me-1"></i>
                  Fuel at Start (litres) *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="fuelStart"
                  value={formData.fuelStart}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  style={{ borderLeft: "4px solid #dc3545" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="fas fa-info-circle text-primary me-1"></i>
              Status
            </Form.Label>
            {isEdit ? (
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select-lg"
                style={{ borderLeft: "4px solid #007bff" }}
              >
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            ) : (
              <Form.Control
                type="text"
                name="status"
                value="scheduled"
                readOnly
                className="form-control-lg bg-light"
                style={{ borderLeft: "4px solid #6c757d" }}
              />
            )}
          </Form.Group>

          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="primary"
              type="submit"
              disabled={creating || updating}
              className="px-4 py-2 fw-semibold"
              style={{
                background:
                  creating || updating
                    ? undefined
                    : "linear-gradient(45deg, #007bff, #0056b3)",
                border: "none",
                minWidth: "140px",
              }}
            >
              {creating || updating ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <i
                    className={`fas ${isEdit ? "fa-save" : "fa-plus"} me-2`}
                  ></i>
                  {isEdit ? "Update Trip" : "Create Trip"}
                </>
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/trips")}
              className="px-4 py-2 fw-semibold"
              style={{ minWidth: "120px" }}
            >
              <i className="fas fa-times me-2"></i>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default TripForm;
