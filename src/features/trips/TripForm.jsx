import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCreateTripMutation } from "./tripsApi";
import { toast } from "react-toastify";
import { useGetDriversQuery } from "../../api/authApi";
// import { useGetTrucksQuery } from "../dashboard/dashboardApi";
import { useGetTrucksQuery } from "../features/trucks/trucksApi";

const TripForm = () => {
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

  const { data: trucks = [] } = useGetTrucksQuery();
  const { data: drivers = [] } = useGetDriversQuery();
  const [createTrip, { isLoading }] = useCreateTripMutation();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const selectedDriver = drivers.find((d) => d._id === formData.driver);
      if (!selectedDriver) {
        setError("Please select a driver");
        return;
      }

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

      await createTrip(submitData).unwrap();
      toast.success("Trip created successfully");
      navigate("/trips");
    } catch (err) {
      setError(err.data?.message || "Error creating trip");
    }
  };

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
                {/* form fields */}
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Trip"}
                </Button>
                <Button variant="secondary" onClick={() => navigate("/trips")}>
                  Cancel
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TripForm;

// import { useGetDriversQuery } from '../features/auth/authApi';
// import { useGetTrucksQuery } from '../features/trucks/trucksApi';

// const TripForm = () => {
//   const { data: drivers = [], isLoading: driversLoading } = useGetDriversQuery();
//   const { data: trucks = [], isLoading: trucksLoading } = useGetTrucksQuery();

//   if (driversLoading || trucksLoading) {
//     return <Spinner animation="border" />;
//   }

//   return (
//     <form>
//       <select name="driver_id">
//         {drivers.map(driver => (
//           <option key={driver._id} value={driver._id}>
//             {driver.name}
//           </option>
//         ))}
//       </select>

//       <select name="truck_id">
//         {trucks.map(truck => (
//           <option key={truck._id} value={truck._id}>
//             {truck.licensePlate}
//           </option>
//         ))}
//       </select>
//     </form>
//   );
// };
