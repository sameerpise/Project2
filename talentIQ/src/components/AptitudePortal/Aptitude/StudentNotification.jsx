import React, { useEffect, useState } from "react";
import { Badge, IconButton, Menu, MenuItem, ListItemText, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function StudentNotifications({ studentId }) {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`https://project2-f2lk.onrender.com/api/notifications/${studentId}`);
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
      await fetch(`https://project2-bkuo.onrender.com/api/notifications/read/${notifId}`, {
        method: "POST",
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        PaperProps={{ style: { maxHeight: 300, width: 320, padding: 0 } }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n._id}
              onClick={() => handleMarkRead(n._id)}
              sx={{ alignItems: "flex-start" }}
            >
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontWeight: n.read ? "normal" : "bold",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {n.message}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      mt: 0.3,
                      wordBreak: "break-word",
                    }}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
