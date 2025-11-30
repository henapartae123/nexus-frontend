import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      state.loading = false;
    },

    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },

    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },

    setNotificationsLoading: (state, action) => {
      state.loading = action.payload;
    },

    setNotificationsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  setNotificationsLoading,
  setNotificationsError,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
