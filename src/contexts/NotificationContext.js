// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "./AuthContext";
// import {
//   initializeSocket,
//   connectSocket,
//   disconnectSocket,
//   getSocket,
// } from "../utils/socket";

// const NotificationContext = createContext();

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error(
//       "useNotifications must be used within a NotificationProvider"
//     );
//   }
//   return context;
// };

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user) {
//       initializeSocket();
//       connectSocket(user._id);

//       const socket = getSocket();
//       if (socket) {
//         socket.on("new-notification", (notification) => {
//           setNotifications((prev) => [notification, ...prev]);
//           if (!notification.seen) {
//             setUnreadCount((prev) => prev + 1);
//           }
//         });
//       }

//       fetchNotifications();
//       const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

//       return () => {
//         clearInterval(interval);
//         disconnectSocket();
//       };
//     }
//   }, [user]);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/notifications");
//       setNotifications(response.data);
//       setUnreadCount(response.data.filter((n) => !n.seen).length);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError("Failed to load notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsSeen = async (notificationId) => {
//     try {
//       await axios.put(`/api/notifications/${notificationId}/read`);
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notificationId ? { ...n, seen: true } : n))
//       );
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error("Error marking notification as seen:", error);
//     }
//   };

//   const markAllAsSeen = async () => {
//     try {
//       await axios.put("/api/notifications/mark-all-read");
//       setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Error marking all notifications as seen:", error);
//     }
//   };

//   const value = {
//     notifications,
//     unreadCount,
//     loading,
//     error,
//     fetchNotifications,
//     markAsSeen,
//     markAllAsSeen,
//   };

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };
