// attendanceSchema.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
  },
  attendance: {
    attended: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
});

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = AttendanceModel;
