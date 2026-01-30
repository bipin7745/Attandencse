import Attendance from "../models/Attendance.js";
import AttendanceRequest from "../models/AttendanceRequest.js";

export const sendAttendanceRequest = async (req, res) => {
  try {
    const { checks, reason, date, requestId } = req.body;

    if (!checks || !Array.isArray(checks) || checks.length === 0)
      return res.status(400).json({ message: "Checks are required" });
    if (!date) return res.status(400).json({ message: "Date is required" });

    const sortChecksByTime = (checksArray) =>
      checksArray
        .map((c) => ({ ...c, time: new Date(c.time) }))
        .sort((a, b) => a.time - b.time)
        .map((c) => ({
          type: c.type,
          time: c.time.toISOString(),
          isNew: c.isNew ?? true,
          edited: c.edited ?? false,
        }));

    const sortedChecks = sortChecksByTime(checks);

    let request;

    if (requestId) {
      request = await AttendanceRequest.findById(requestId);
      if (!request)
        return res.status(404).json({ message: "Request not found" });

      // update checks preserving flags
      const updatedChecks = sortedChecks.map((c, idx) => ({
        type: c.type,
        time: c.time,
        isNew: c.isNew ?? true,
        edited: c.edited ?? false,
      }));

      request.checks = updatedChecks;
      request.reason = reason || request.reason;
      await request.save();
    } else {
      const attendance = await Attendance.findOne({
        userId: req.user.id,
        date,
      });

      request = await AttendanceRequest.create({
        userId: req.user.id,
        attendanceId: attendance?._id || null,
        checks: sortedChecks,
        reason,
      });
    }

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    console.error("Error in sendAttendanceRequest:", err);
    res.status(500).json({ message: err.message });
  }
};

// USER / ADMIN → GET ALL REQUESTS
export const getAllRequests = async (req, res) => {
  try {
    const requests = await AttendanceRequest.find()
      .populate("userId", "username role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllRequestsForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await AttendanceRequest.find({ userId: userId })
      .populate("userId", "username role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET REQUEST BY ID
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await AttendanceRequest.findById(id).populate(
      "userId",
      "username role",
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve attendance request and merge missing checks
export const approveRequest = async (req, res) => {
  try {
    const reqObj = await AttendanceRequest.findById(req.params.id);
    if (!reqObj) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!reqObj.userId || !reqObj.checks?.length) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Attendance date
    const attendanceDate = new Date(reqObj.checks[0].time)
      .toISOString()
      .split("T")[0];

    // 1️⃣ Approve request
    reqObj.status = "Approved";
    await reqObj.save();

    // 2️⃣ Find or create attendance
    let attendance = await Attendance.findOne({
      userId: reqObj.userId,
      date: attendanceDate,
    });

    if (!attendance) {
      attendance = new Attendance({
        userId: reqObj.userId,
        date: attendanceDate,
      });
    }

    // 3️⃣ 🔥 IMPORTANT: Replace checks (NO MERGE)
    attendance.checks = reqObj.checks.map((c) => ({
      type: c.type,
      time: new Date(c.time),
    }));

    // 4️⃣ Sort checks
    attendance.checks.sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );

    // 5️⃣ Calculate work & break
    let totalWorkMs = 0;
    let breakMs = 0;
    let lastIn = null;
    let lastOut = null;

    attendance.checks.forEach((check) => {
      const time = new Date(check.time);

      if (check.type === "In") {
        if (lastOut) {
          breakMs += time - lastOut;
          lastOut = null;
        }
        lastIn = time;
      }

      if (check.type === "Out" && lastIn) {
        totalWorkMs += time - lastIn;
        lastIn = null;
        lastOut = time;
      }
    });

    attendance.totalHours = +(totalWorkMs / 3600000).toFixed(2);
    attendance.Break = +(breakMs / 3600000).toFixed(2);
    attendance.requestStatus = "Approved";
    attendance.reason = reqObj.reason || "";

    await attendance.save();

    // 6️⃣ Link attendance to request
    reqObj.attendanceId = attendance._id;
    await reqObj.save();

    return res.json({
      success: true,
      message: "Attendance approved successfully",
      request: reqObj,
      attendance,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: err.message });
  }
};


// REJECT REQUEST
export const rejectRequest = async (req, res) => {
  try {
    const reqObj = await AttendanceRequest.findById(req.params.id);
    if (!reqObj) return res.status(404).json({ message: "Request not found" });
    reqObj.status = "Rejected";
    await reqObj.save();
    res.json({ success: true, data: reqObj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
