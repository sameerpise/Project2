const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }, // to track if student has seen it
  meta: { type: Object } // optional additional info, e.g., type: "retest"
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
