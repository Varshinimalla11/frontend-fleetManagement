// src/components/TruckDetails.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Button, Card } from "react-bootstrap";
import { useGetTruckByIdQuery } from "../../api/trucksApi";

const TruckDetails = () => {
  const { id } = useParams();
  const { data: truck, error, isLoading } = useGetTruckByIdQuery(id);

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <div>Error loading truck details</div>;
  if (!truck) return <div>Truck not found</div>;

  return (
    <Container className="mt-4">
      <h1>Truck Details</h1>
      <Card>
        <Card.Body>
          <Card.Title>{truck.plate_number}</Card.Title>
          <Card.Text>
            <strong>Condition: </strong> {truck.condition}
          </Card.Text>
          <Card.Text>
            <strong>Mileage Factor: </strong> {truck.mileage_factor}
          </Card.Text>
          <Button as={Link} to="/trucks" variant="secondary">
            Back to List
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TruckDetails;
