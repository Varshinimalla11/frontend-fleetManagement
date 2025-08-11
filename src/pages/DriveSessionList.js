"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Badge } from "react-bootstrap"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import moment from "moment"

const DriveSessionList = () => {
  const [driveSessions, setDriveSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchDriveSessions()
  }, [])

  const fetchDriveSessions = async () => {
    try {
      const response = await axios.get("/api/drive-sessions")
      setDriveSessions(response.data)
    } catch (error) {
      console.error("Error fetching drive sessions:", error)
      toast.error("Error loading drive sessions")
    } finally {
      setLoading(false)
    }
  }

  const startDriveSession = async () => {
    try {
      const response = await axios.post("/api/drive-sessions/start")
      setDriveSessions([response.data, ...driveSessions])
      toast.success("Drive session started")
    } catch (error) {
      console.error("Error starting drive session:", error)
      toast.error("Error starting drive session")
    }
  }

  const endDriveSession = async (sessionId) => {
    try {
      const response = await axios.put(`/api/drive-sessions/${sessionId}/end`)
      setDriveSessions(driveSessions.map((session) => (session._id === sessionId ? response.data : session)))
      toast.success("Drive session ended")
    } catch (error) {
      console.error("Error ending drive session:", error)
      toast.error("Error ending drive session")
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      completed: "secondary",
    }
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>
  }

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    )
  }

  const activeSessions = driveSessions.filter((session) => session.status === "active")

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Drive Sessions</h1>
            {user.role === "driver" && activeSessions.length === 0 && (
              <Button variant="success" onClick={startDriveSession}>
                <i className="fas fa-play me-2"></i>
                Start Drive Session
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Active Sessions Alert */}
      {activeSessions.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="border-success">
              <Card.Body>
                <h5 className="text-success">
                  <i className="fas fa-clock me-2"></i>
                  Active Drive Session
                </h5>
                {activeSessions.map((session) => (
                  <div key={session._id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1">Started: {moment(session.startTime).format("MMM DD, YYYY HH:mm")}</p>
                      <p className="mb-0 text-muted">
                        Duration: {moment.duration(moment().diff(moment(session.startTime))).humanize()}
                      </p>
                    </div>
                    {user.role === "driver" && (
                      <Button variant="danger" onClick={() => endDriveSession(session._id)}>
                        <i className="fas fa-stop me-2"></i>
                        End Session
                      </Button>
                    )}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {driveSessions.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th>Truck</th>
                      <th>Trip</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driveSessions.map((session) => (
                      <tr key={session._id}>
                        <td>{session.driver?.name || "Unknown"}</td>
                        <td>{session.truck?.licensePlate || "Unassigned"}</td>
                        <td>
                          {session.trip ? `${session.trip.origin} → ${session.trip.destination}` : "No trip assigned"}
                        </td>
                        <td>{moment(session.startTime).format("MMM DD, HH:mm")}</td>
                        <td>{session.endTime ? moment(session.endTime).format("MMM DD, HH:mm") : "Ongoing"}</td>
                        <td>
                          {session.endTime
                            ? moment.duration(moment(session.endTime).diff(moment(session.startTime))).humanize()
                            : moment.duration(moment().diff(moment(session.startTime))).humanize()}
                        </td>
                        <td>{getStatusBadge(session.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                  <h4>No drive sessions found</h4>
                  <p className="text-muted">Drive sessions will appear here once started.</p>
                  {user.role === "driver" && (
                    <Button variant="success" onClick={startDriveSession}>
                      Start First Drive Session
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DriveSessionList
