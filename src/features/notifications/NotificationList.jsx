import React, { useState } from "react";
import { Spinner, Table, Badge, Button, Modal } from "react-bootstrap";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "../../api/notificationsApi";
import moment from "moment";
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
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Notifications</h4>
        <Button
          onClick={handleMarkAllRead}
          disabled={!notifications.some((n) => !n.seen)}
          className="mb-3"
          variant="primary"
        >
          Mark All Read
        </Button>
      </div>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Message</th>
              <th>Received</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n._id} className={!n.seen ? "fw-bold" : ""}>
                <td>{n.message}</td>
                <td>{moment(n.createdAt).fromNow()}</td>
                <td>
                  {n.seen ? (
                    <Badge bg="success">Read</Badge>
                  ) : (
                    <Badge bg="warning">Unread</Badge>
                  )}
                </td>
                <td>
                  {!n.seen && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleMarkRead(n._id)}
                      className="me-2"
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedNotification(n);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete this notification?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationsList;
