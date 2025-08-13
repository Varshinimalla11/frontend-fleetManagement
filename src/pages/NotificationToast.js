"use client";
import { Toast } from "react-bootstrap";
import { useNotifications } from "../contexts/NotificationContext";
import { useEffect, useState } from "react";

export default function NotificationToast() {
  const { notifications } = useNotifications();
  const [show, setShow] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.seen);
    if (unread.length > 0) {
      setLatestNotification(unread[0]);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!latestNotification) return null;

  return (
    <Toast
      show={show}
      onClose={() => setShow(false)}
      className="position-fixed bottom-0 end-0 m-3"
      bg={latestNotification.type || "light"}
    >
      <Toast.Header closeButton>
        <strong className="me-auto">{latestNotification.title}</strong>
      </Toast.Header>
      <Toast.Body>{latestNotification.message}</Toast.Body>
    </Toast>
  );
}
