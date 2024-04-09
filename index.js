const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Attendance = require("./attendanceSchema"); // Adjust the path as per your project structure
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

const atlasConnectionUri = process.env.ATLAS_URI;
const dbName = "subjects";

mongoose.connect(atlasConnectionUri, {
  dbName: "subjects",
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

app.use(
  cors({
    origin: ["deployed-vercel-frontend-app", "localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("Hello");
});

// Example route to fetch all "subjects" from the "subjects" collection
mongoose.connection.on("connected", () => {
  app.get("/subjects", async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const subjectsCollection = db.collection("subjects");
      const subjects = await subjectsCollection.find().toArray();
      res.json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.get("/getattendance", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const subjectsCollection = db.collection("attendances");
    const attendanceStud = await subjectsCollection.find().toArray();

    console.log(attendanceStud);

    res.json(attendanceStud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Example route to update attendance for a subject
app.post("/update-attendance-yes/:subject_name", async (req, res) => {
  try {
    const subjectName = req.params.subject_name;
    const attended = req.params.attendance;

    // Find the attendance record for the subject
    let attendanceRecord = await Attendance.findOne({
      subject_name: subjectName,
    });

    // If the record doesn't exist, create a new one
    if (!attendanceRecord) {
      attendanceRecord = new Attendance({
        subject_name: subjectName,
        attendance: { attended: 0, total: 0 },
      });
    }

    // Ensure "attendance" field is defined
    if (!attendanceRecord.attendance) {
      attendanceRecord.attendance = { attended: 0, total: 0 };
    }

    // Update attendance based on the "attended" parameter
    if (attended === "yes") {
      attendanceRecord.attendance.attended += 1;
      attendanceRecord.attendance.total += 1;
    }

    // Always increment the total
    attendanceRecord.attendance.total += 1;
    attendanceRecord.attendance.attended += 1;

    // Save the updated attendance record
    await attendanceRecord.save();

    res.json({ success: true, message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/update-attendance-no/:subject_name", async (req, res) => {
  try {
    const subjectName = req.params.subject_name;
    const attended = req.params.attendance;

    // Find the attendance record for the subject
    let attendanceRecord = await Attendance.findOne({
      subject_name: subjectName,
    });

    // If the record doesn't exist, create a new one
    if (!attendanceRecord) {
      attendanceRecord = new Attendance({
        subject_name: subjectName,
        attendance: { attended: 0, total: 0 },
      });
    }

    // Ensure "attendance" field is defined
    if (!attendanceRecord.attendance) {
      attendanceRecord.attendance = { attended: 0, total: 0 };
    }

    // Update attendance based on the "attended" parameter
    if (attended === "yes") {
      attendanceRecord.attendance.attended += 1;
      attendanceRecord.attendance.total += 1;
    }

    // Always increment the total
    attendanceRecord.attendance.total += 1;

    // Save the updated attendance record
    await attendanceRecord.save();

    res.json({ success: true, message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
