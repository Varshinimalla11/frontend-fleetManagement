"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    activeTrips: 0,
    totalDrivers: 0,
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [trucksRes, tripsRes, driversRes, activitiesRes] =
        await Promise.all([
          axios.get("/api/trucks"),
          axios.get("/api/trips"),
          axios.get("/api/auth/my-drivers"),
          axios.get("/api/notifications?limit=5"),
        ]);

      setStats({
        totalTrucks: trucksRes.data.length,
        activeTrips: tripsRes.data.filter((trip) => trip.status === "active")
          .length,
        totalDrivers: driversRes.data.length,
        recentActivities: activitiesRes.data,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
          <p className="text-muted">Welcome back, {user.name}!</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="fas fa-truck fa-2x text-primary mb-2"></i>
              <h3>{stats.totalTrucks}</h3>
              <p className="text-muted">Total Trucks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="fas fa-route fa-2x text-success mb-2"></i>
              <h3>{stats.activeTrips}</h3>
              <p className="text-muted">Active Trips</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="fas fa-users fa-2x text-info mb-2"></i>
              <h3>{stats.totalDrivers}</h3>
              <p className="text-muted">Total Drivers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="fas fa-bell fa-2x text-warning mb-2"></i>
              <h3>{stats.recentActivities.length}</h3>
              <p className="text-muted">Recent Activities</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Quick Actions */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {(user.role === "owner" || user.role === "admin") && (
                  <>
                    <Button as={Link} to="/trucks/new" variant="primary">
                      <i className="fas fa-plus me-2"></i>
                      Add New Truck
                    </Button>
                    <Button as={Link} to="/trips/new" variant="success">
                      <i className="fas fa-plus me-2"></i>
                      Create New Trip
                    </Button>
                    <Button as={Link} to="/invite-driver" variant="info">
                      <i className="fas fa-user-plus me-2"></i>
                      Invite Driver
                    </Button>
                  </>
                )}
                <Button
                  as={Link}
                  to="/drive-sessions"
                  variant="outline-primary"
                >
                  <i className="fas fa-clock me-2"></i>
                  View Drive Sessions
                </Button>
                <Button as={Link} to="/refuel-events" variant="outline-success">
                  <i className="fas fa-gas-pump me-2"></i>
                  Log Refuel Event
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentActivities.length > 0 ? (
                <Table responsive size="sm">
                  <tbody>
                    {stats.recentActivities.map((activity, index) => (
                      <tr key={index}>
                        <td>
                          <Badge
                            bg={
                              activity.type === "info" ? "primary" : "warning"
                            }
                          >
                            {activity.type}
                          </Badge>
                        </td>
                        <td>{activity.message}</td>
                        <td className="text-muted small">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">No recent activities</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
