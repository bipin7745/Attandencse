// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";

// ===== CHECK-IN =====
export const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time required" });
    }

    const logTime = new Date(`${date}T${time}`);

    let attendance = await Attendance.findOne({ userId, date });

    
    if (attendance && attendance.requestStatus === "Approved") {
      return res.status(400).json({
        message: "Your request is Approved. You cannot check in right now.",
      });
    }


    if (attendance && attendance.requestStatus === "Rejected") {
      return res.status(400).json({
        message: "Your request is rejected.",
      });
    }

    if (!attendance) {
      attendance = await Attendance.create({
        userId,
        date,
        checks: [{ type: "In", time: logTime }],
      
      });

      return res.status(201).json({
        success: true,
        data: attendance,
      });
    }

    attendance.checks.push({ type: "In", time: logTime });
    await attendance.save();
    res.json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===== CHECK-OUT =====
export const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time required" });
    }

    const logTime = new Date(`${date}T${time}`);

    const attendance = await Attendance.findOne({ userId, date });

    if (!attendance) {
      return res.status(400).json({
        message: "You must check in first",
      });
    }

    if (attendance.requestStatus === "Approved") {
      return res.status(400).json({
        message: "Your request is Approved. You cannot check out.",
      });
    }

    
    if (attendance.requestStatus === "Rejected") {
      return res.status(400).json({
        message: "Your request is rejected. ",
      });
    }

    // ✅ Push Out
    attendance.checks.push({ type: "Out", time: logTime });
    await attendance.save();

    res.json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== FETCH ATTENDANCE =====
export const fetchAttendance = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const data = await Attendance.find({ userId }).sort({ date: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== FETCH ALL ATTENDANCE =====
export const fetchAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find().sort({ date: -1 }).populate("userId", "username email role");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== UPDATE STATUS & CALCULATE HOURS =====
export const updateAttendanceStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const { id } = req.params;

    const attendance = await Attendance.findById(id).populate("userId", "username email");
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });

    attendance.requestStatus = status;

    if (status === "Rejected") {
      attendance.reason = reason || "";
      attendance.totalHours = 0;
      attendance.Break = 0;
    }

    if (status === "Approved") {
      let totalWork = 0, totalBreak = 0;
      let lastInTime = null, lastOutTime = null;

      attendance.checks.forEach(record => {
        const time = new Date(record.time);
        if (record.type === "In") {
          if (lastOutTime) {
            totalBreak += (time - lastOutTime) / (1000 * 60 * 60);
            lastOutTime = null;
          }
          lastInTime = time;
        } else if (record.type === "Out") {
          if (lastInTime) {
            totalWork += (time - lastInTime) / (1000 * 60 * 60);
            lastInTime = null;
          }
          lastOutTime = time;
        }
      });

      attendance.totalHours = parseFloat(totalWork.toFixed(2));
      attendance.Break = parseFloat(totalBreak.toFixed(2));
    }

    await attendance.save();
    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const fetchAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findById(id).populate(
      "userId",
      "username email role"
    );

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
