// src/components/TruckDetails.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Button, Card, Badge } from "react-bootstrap";
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
    <div className="bg-primary bg-opacity-25 min-vh-100 d-flex justify-content-center align-items-center p-3">
      <Card
        className="shadow-lg border-0 rounded-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <Card.Body className="p-4">
          <h2 className="mb-4 fw-bold text-center text-primary">
            Truck Details
          </h2>
          <div className="mb-3 p-3 bg-light rounded-3">
            <span className="fw-semibold text-muted">Plate Number:</span>
            <div className="fs-5 fw-bold text-dark">{truck.plate_number}</div>
          </div>
          <div className="mb-3 p-3 bg-light rounded-3">
            <span className="fw-semibold text-muted">Condition:</span>
            <div className="mt-2">
              <Badge
                bg={conditionColors[truck.condition]}
                className="fs-6 px-3 py-2 rounded-pill"
              >
                {truck.condition.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
          <div className="mb-4 p-3 bg-light rounded-3">
            <span className="fw-semibold text-muted">Mileage Factor:</span>
            <div className="fs-5 fw-bold text-dark">{truck.mileage_factor}</div>
          </div>
          <Button
            as={Link}
            to="/trucks"
            variant="outline-primary"
            className="w-100 py-2 fw-semibold rounded-3"
          >
            Back to List
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TruckDetails;
