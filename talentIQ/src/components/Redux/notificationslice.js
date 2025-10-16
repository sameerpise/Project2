// notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base URL (adjust if needed)
const API_BASE = 'http://localhost:5000/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async ({ role, userId }) => {
    const res = await fetch(`${API_BASE}/notifications/${role}/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  }
);

export const markAllRead = createAsyncThunk(
  'notifications/markAllRead',
  async ({ role, userId }) => {
    const res = await fetch(`${API_BASE}/notifications/mark-read/${role}/${userId}`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to mark read');
    return { userId };
  }
);

export const createNotification = createAsyncThunk(
  'notifications/create',
  async ({ userId, role, message, meta }) => {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role, message, meta })
    });
    if (!res.ok) throw new Error('Failed to create notification');
    return res.json();
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchNotifications.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(markAllRead.fulfilled, (s) => { s.items = s.items.map(n => ({ ...n, read: true })); })
      .addCase(createNotification.fulfilled, (s, a) => { s.items = [a.payload, ...s.items]; });
  }
});

export default notificationsSlice.reducer;
