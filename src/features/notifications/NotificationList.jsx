"use client";

import { useState } from "react";
import { Spinner, Table, Badge, Button, Modal, Card } from "react-bootstrap";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "../../api/notificationsApi";
import { toast } from "react-toastify";

const NotificationsList = () => {
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 6000, // auto refresh every 30 seconds
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      toast.success("Notification marked as read");
      refetch();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(selectedNotification._id).unwrap();
      toast.success("Notification deleted");
      refetch();
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setShowDeleteModal(false);
      setSelectedNotification(null);
    }
  };
  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      toast.success("All notifications marked as read");
      refetch();
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "400px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            variant="light"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-white mt-3 fs-5">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px 0",
      }}
    >
      <div className="container">
        <Card className="shadow-lg border-0 mb-4">
          <Card.Header
            className="text-white py-4"
            style={{
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              borderRadius: "0.5rem 0.5rem 0 0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold">
                <i className="fas fa-bell me-3"></i>
                Notifications
                {notifications.filter((n) => !n.seen).length > 0 && (
                  <Badge bg="warning" className="ms-2">
                    {notifications.filter((n) => !n.seen).length} unread
                  </Badge>
                )}
              </h4>
              <Button
                onClick={handleMarkAllRead}
                disabled={!notifications.some((n) => !n.seen)}
                className="btn-light fw-semibold px-4"
                style={{
                  border: "none",
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fas fa-check-double me-2"></i>
                Mark All Read
              </Button>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p className="text-muted fs-5">No notifications</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-envelope me-2"></i>Message
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-tag me-2"></i>Type
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-eye me-2"></i>Status
                    </th>
                    <th className="py-3 px-4 fw-semibold text-dark">
                      <i className="fas fa-cogs me-2"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((n) => (
                    <tr
                      key={n._id}
                      className={!n.seen ? "fw-bold" : ""}
                      style={{
                        backgroundColor: !n.seen
                          ? "rgba(255, 193, 7, 0.1)"
                          : "transparent",
                        borderLeft: !n.seen
                          ? "4px solid #ffc107"
                          : "4px solid transparent",
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <i
                            className={`fas ${
                              !n.seen ? "fa-envelope" : "fa-envelope-open"
                            } me-3 text-${!n.seen ? "warning" : "success"}`}
                          ></i>
                          {n.message}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          bg={
                            n.type === "info"
                              ? "info"
                              : n.type === "warning"
                              ? "warning"
                              : "primary"
                          }
                          className="px-3 py-2 rounded-pill"
                        >
                          <i
                            className={`fas ${
                              n.type === "info"
                                ? "fa-info-circle"
                                : n.type === "warning"
                                ? "fa-exclamation-triangle"
                                : "fa-bell"
                            } me-1`}
                          ></i>
                          {n.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {n.seen ? (
                          <Badge
                            bg="success"
                            className="px-3 py-2 rounded-pill"
                          >
                            <i className="fas fa-check me-1"></i>Read
                          </Badge>
                        ) : (
                          <Badge
                            bg="warning"
                            className="px-3 py-2 rounded-pill"
                          >
                            <i className="fas fa-exclamation me-1"></i>Unread
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex gap-2">
                          {!n.seen && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleMarkRead(n._id)}
                              className="px-3 rounded-pill fw-semibold"
                              style={{ transition: "all 0.3s ease" }}
                            >
                              <i className="fas fa-check me-1"></i>Mark Read
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedNotification(n);
                              setShowDeleteModal(true);
                            }}
                            className="px-3 rounded-pill fw-semibold"
                            style={{ transition: "all 0.3s ease" }}
                          >
                            <i className="fas fa-trash me-1"></i>Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #dc3545, #c82333)",
            color: "white",
          }}
        >
          <Modal.Title className="fw-bold">
            <i className="fas fa-trash-alt me-2"></i>Delete Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <p className="fs-5 mb-0">
              Are you sure you want to delete this notification?
            </p>
            <small className="text-muted">This action cannot be undone.</small>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            className="px-4 rounded-pill fw-semibold"
          >
            <i className="fas fa-times me-2"></i>Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="px-4 rounded-pill fw-semibold"
            style={{
              background: "linear-gradient(135deg, #dc3545, #c82333)",
              border: "none",
            }}
          >
            <i className="fas fa-trash me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationsList;
