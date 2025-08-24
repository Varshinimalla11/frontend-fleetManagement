"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDriveSessionsByTripQuery,
  useStartDriveSessionMutation,
  useEndDriveSessionMutation,
  useDeleteDriveSessionMutation,
} from "../../api/driveSessionsApi";
import { Table, Button, Badge, Spinner, Modal, Card } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";

const DriveSessionList = () => {
  const { tripId } = useParams();
  const { data: sessions = [], isLoading } =
    useGetDriveSessionsByTripQuery(tripId);
  const [startDriveSession] = useStartDriveSessionMutation();
  const [endDriveSession] = useEndDriveSessionMutation();

  const [endConfirmModal, setEndConfirmModal] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState(null);

  const handleStart = async () => {
    try {
      await startDriveSession(tripId).unwrap();
      toast.success("Drive session started successfully");
    } catch (err) {
      toast.error(err.data?.message || "Error starting drive session");
    }
  };

  const handleEnd = async () => {
    try {
      await endDriveSession(sessionToEnd._id).unwrap();
      toast.success("Drive session ended successfully");
    } catch (err) {
      toast.error(err.data?.message || "Error ending drive session");
    } finally {
      setEndConfirmModal(false);
      setSessionToEnd(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "60px",
            height: "60px",
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            borderRadius: "50%",
            color: "white",
          }}
        >
          <Spinner
            animation="border"
            style={{ width: "2rem", height: "2rem" }}
          />
        </div>
        <h5 className="text-muted">Loading drive sessions...</h5>
      </div>
    );
  }

  return (
    <>
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header
          className="text-white text-center py-3"
          style={{
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            borderRadius: "0.375rem 0.375rem 0 0",
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="fas fa-road fa-2x me-3"></i>
              <div>
                <h5 className="mb-0">Drive Sessions</h5>
                <small>Track your driving activity</small>
              </div>
            </div>
            <Button
              style={{
                background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                border: "none",
                borderRadius: "25px",
                padding: "0.5rem 1.5rem",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
              }}
              onClick={handleStart}
              className="d-flex align-items-center"
            >
              <i className="fas fa-play me-2"></i>
              Start Session
            </Button>
          </div>
        </Card.Header>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                }}
              >
                <th
                  style={{
                    border: "none",
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  <i className="fas fa-clock me-2 text-success"></i>Start Time
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  <i className="fas fa-stop-circle me-2 text-danger"></i>End
                  Time
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  <i className="fas fa-hourglass-half me-2 text-info"></i>
                  Duration
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  <i className="fas fa-info-circle me-2 text-primary"></i>Status
                </th>
                <th
                  style={{
                    border: "none",
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  <i className="fas fa-cogs me-2 text-warning"></i>Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr
                  key={session._id}
                  style={{
                    borderLeft: `4px solid ${
                      session.status === "active" ? "#28a745" : "#6c757d"
                    }`,
                    transition: "all 0.3s ease",
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: "1rem" }}>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-calendar-alt me-2 text-muted"></i>
                      {moment(session.startTime).format("MMM DD, YYYY HH:mm")}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div className="d-flex align-items-center">
                      <i
                        className={`fas ${
                          session.endTime
                            ? "fa-check-circle text-success"
                            : "fa-spinner fa-spin text-warning"
                        } me-2`}
                      ></i>
                      {session.endTime
                        ? moment(session.endTime).format("MMM DD, YYYY HH:mm")
                        : "Ongoing"}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-clock me-2 text-muted"></i>
                      {session.endTime
                        ? moment
                            .duration(
                              moment(session.endTime).diff(
                                moment(session.startTime)
                              )
                            )
                            .humanize()
                        : "Ongoing"}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <Badge
                      style={{
                        background:
                          session.status === "active"
                            ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                            : "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontWeight: "500",
                      }}
                    >
                      <i
                        className={`fas ${
                          session.status === "active" ? "fa-play" : "fa-stop"
                        } me-1`}
                      ></i>
                      {session.status}
                    </Badge>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {session.status === "active" && (
                      <Button
                        style={{
                          background:
                            "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                          border: "none",
                          borderRadius: "20px",
                          padding: "0.4rem 1rem",
                          fontWeight: "500",
                          boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)",
                        }}
                        size="sm"
                        onClick={() => {
                          setSessionToEnd(session);
                          setEndConfirmModal(true);
                        }}
                        className="d-flex align-items-center"
                      >
                        <i className="fas fa-stop me-1"></i>
                        End
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        show={endConfirmModal}
        onHide={() => setEndConfirmModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
            color: "white",
            border: "none",
          }}
        >
          <Modal.Title className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle me-2"></i>
            End Drive Session
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center">
            <i className="fas fa-question-circle fa-3x text-warning mb-3"></i>
            <p className="mb-0">
              Are you sure you want to end this session started at{" "}
              <strong>
                {moment(sessionToEnd?.startTime).format("MMM DD, YYYY HH:mm")}
              </strong>
              ?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none", padding: "1rem 1.5rem" }}>
          <Button
            variant="outline-secondary"
            onClick={() => setEndConfirmModal(false)}
            style={{ borderRadius: "20px", padding: "0.5rem 1.5rem" }}
          >
            <i className="fas fa-times me-1"></i>
            Cancel
          </Button>
          <Button
            onClick={handleEnd}
            style={{
              background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
              border: "none",
              borderRadius: "20px",
              padding: "0.5rem 1.5rem",
              fontWeight: "500",
            }}
          >
            <i className="fas fa-stop me-1"></i>
            End Session
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .table-row-hover:hover {
          background-color: #f8f9ff !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default DriveSessionList;
