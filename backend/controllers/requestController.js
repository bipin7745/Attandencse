import AssetRequest from "../models/AssetsRequest.js";
import AssetAssignment from "../models/AssetsAssign.js";
import AssetsDevice from "../models/AssetsDevice.js";


export const sendAssetRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { assignmentId, reason } = req.body;

    if (!assignmentId || !reason) {
      return res.status(400).json({
        message: "Assignment & reason required",
      });
    }
    const assignment = await AssetAssignment.findById(assignmentId)
      .populate("asset", "name");

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    if (assignment.assignedToUser.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const existing = await AssetRequest.findOne({
      assignment: assignmentId,
      requestedBy: userId,
      reqstatus: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }


    const request = await AssetRequest.create({
      assignment: assignmentId,

      asset: assignment.asset._id,       
      assetName: assignment.asset.name,   
      requestedBy: userId,
      reason,
      reqstatus: "pending",
    });


    assignment.requestStatus = "pending";
    await assignment.save();

    res.status(201).json({
      message: "Asset request sent successfully",
      request,
    });
  } catch (error) {
    console.error("SEND REQUEST ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await AssetRequest.find()
      .populate("asset", "name")
      .populate("requestedBy", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Approve device request
export const approveDeviceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusType, feedback } = req.body;

    const request = await AssetRequest.findById(id);
    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (request.reqstatus !== "pending")
      return res.status(400).json({ message: "Request already processed" });

    const assignment = await AssetAssignment.findById(request.assignment);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    const asset = await AssetsDevice.findById(assignment.asset);
    if (!asset)
      return res.status(404).json({ message: "Asset not found" });

  
    request.reqstatus = "approved";
    request.feedback = feedback || "";
    request.deviceCondition = statusType; 


    if (statusType === "Active") {
  
      asset.quality += assignment.assignedQty;
      assignment.status = "Inactive";
    }

    if (statusType === "Defective") {
      assignment.status = "Defective";
    }

    assignment.requestStatus = "approved";

    await request.save();
    await asset.save();
    await assignment.save();

    res.status(200).json({
      success: true,
      request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Reject request
export const rejectDeviceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const request = await AssetRequest.findById(id);
    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    if (request.reqstatus.toLowerCase() !== "pending")
      return res
        .status(400)
        .json({ success: false, message: "Request already processed" });

    const assignment = await AssetAssignment.findById(request.assignment);
    if (!assignment)
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });

    request.reqstatus = "rejected";
    request.feedback = feedback || "";
    await request.save();

    assignment.requestStatus = "rejected";
    await assignment.save();

    res.status(200).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


