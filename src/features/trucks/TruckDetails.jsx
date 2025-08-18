// src/components/TruckDetails.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Button, Card, Badge } from "react-bootstrap";
import { useGetTruckByIdQuery } from "../../api/trucksApi";

const TruckDetails = () => {
  const { id } = useParams();
  const { data: truck, error, isLoading } = useGetTruckByIdQuery(id);

  const conditionColors = {
    active: "success",
    maintenance_needed: "warning",
    in_maintenance: "danger",
    inactive: "secondary",
  };

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <div>Error loading truck details</div>;
  if (!truck) return <div>Truck not found</div>;

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
        alignItems: "center",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: "0 2px 16px #0002",
        }}
      >
        <Card.Body className="p-4">
          <h2 className="mb-4 fw-bold text-center">Truck Details</h2>
          <div className="mb-3">
            <b>Plate Number:</b> {truck.plate_number}
          </div>
          <div className="mb-3">
            <b>Condition:</b>{" "}
            <Badge bg={conditionColors[truck.condition]} className="fs-6">
              {truck.condition.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="mb-4">
            <b>Mileage Factor:</b> {truck.mileage_factor}
          </div>
          <Button as={Link} to="/trucks" variant="secondary" className="w-100">
            Back to List
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TruckDetails;
