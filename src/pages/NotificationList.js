"use client"
import { Container, Row, Col, Card, Button, ListGroup, Badge } from "react-bootstrap"
import { useNotifications } from "../contexts/NotificationContext"
import moment from "moment"

const NotificationList = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()

  const getTypeIcon = (type) => {
    const icons = {
      info: "fas fa-info-circle text-primary",
      warning: "fas fa-exclamation-triangle text-warning",
      error: "fas fa-exclamation-circle text-danger",
      success: "fas fa-check-circle text-success",
    }
    return icons[type] || "fas fa-bell text-secondary"
  }

  const unreadNotifications = notifications.filter((n) => !n.read)

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>
              Notifications
              {unreadNotifications.length > 0 && (
                <Badge bg="danger" className="ms-2">
                  {unreadNotifications.length}
                </Badge>
              )}
            </h1>
            {unreadNotifications.length > 0 && (
              <Button variant="outline-primary" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {notifications.length > 0 ? (
                <ListGroup variant="flush">
                  {notifications.map((notification) => (
                    <ListGroup.Item
                      key={notification._id}
                      className={`d-flex justify-content-between align-items-start ${
                        !notification.read ? "bg-light" : ""
                      }`}
                    >
                      <div className="ms-2 me-auto">
                        <div className="d-flex align-items-center mb-1">
                          <i className={`${getTypeIcon(notification.type)} me-2`}></i>
                          <strong className={!notification.read ? "text-primary" : ""}>{notification.title}</strong>
                          {!notification.read && (
                            <Badge bg="primary" className="ms-2">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">{moment(notification.createdAt).fromNow()}</small>
                      </div>
                      {!notification.read && (
                        <Button variant="outline-primary" size="sm" onClick={() => markAsRead(notification._id)}>
                          Mark as Read
                        </Button>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                  <h4>No notifications</h4>
                  <p className="text-muted">You're all caught up! Notifications will appear here.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default NotificationList
