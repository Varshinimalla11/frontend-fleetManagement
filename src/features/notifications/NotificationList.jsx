import { useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} from "./notificationsApi";
import { Table, Button, Badge, Spinner, Modal } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";

const NotificationsList = () => {
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // auto refresh every 30 seconds
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(selectedNotification._id).unwrap();
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setShowDeleteModal(false);
      setSelectedNotification(null);
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
    <>
      <div className="mb-3 d-flex justify-content-between">
        <h4>Notifications</h4>
        <Button variant="outline-primary" size="sm" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <Table responsive bordered hover size="sm">
        <thead>
          <tr>
            <th>Type</th>
            <th>Message</th>
            <th>Created</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n._id}>
              <td>{n.type}</td>
              <td>{n.message}</td>
              <td>{moment(n.createdAt).format("MMM DD, YYYY HH:mm")}</td>
              <td>
                <Badge bg={n.read ? "secondary" : "primary"}>
                  {n.read ? "Read" : "Unread"}
                </Badge>
              </td>
              <td>
                {!n.read && (
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleMarkAsRead(n._id)}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this notification: "
          {selectedNotification?.message}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationsList;
