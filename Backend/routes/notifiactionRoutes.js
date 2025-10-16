const express = require("express");
const Notification = require("../Models/notification");
const router = express.Router();

// Get all notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark a notification as read
router.post("/read/:notifId", async (req, res) => {
  try {
    const { notifId } = req.params;
    const notif = await Notification.findById(notifId);
    if (!notif) return res.status(404).json({ error: "Notification not found" });

    notif.read = true;
    await notif.save();
    res.json({ message: "Notification marked as read", notif });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

module.exports = router;
