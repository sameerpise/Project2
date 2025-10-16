import React, { useEffect, useState } from "react";
import { Badge, IconButton, Menu, MenuItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function StudentNotifications({ studentId }) {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${studentId}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkRead = async (notifId) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/read/${notifId}`, {
        method: "POST"
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 300, width: 300 } }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map(n => (
            <MenuItem key={n._id} onClick={() => handleMarkRead(n._id)}>
              <ListItemText
                primary={n.message}
                secondary={new Date(n.createdAt).toLocaleString()}
                style={{ fontWeight: n.read ? 'normal' : 'bold' }}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
