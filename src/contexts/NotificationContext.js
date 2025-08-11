"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchNotifications()
      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications")
      setNotifications(response.data)
      setUnreadCount(response.data.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`)
      setNotifications((prev) => prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put("/api/notifications/mark-all-read")
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
