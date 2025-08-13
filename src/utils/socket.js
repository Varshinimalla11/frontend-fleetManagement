// utils/socket.js
import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (userId) => {
  if (socket) {
    socket.auth = { userId };
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join-user-room", userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
