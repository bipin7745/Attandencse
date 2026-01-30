import AssetAssignment from "../models/AssetsAssign.js";
import AssetsDevice from "../models/AssetsDevice.js";
import AssetRequest from "../models/AssetsRequest.js";
// 1️⃣ Assign Asset
export const assignAsset = async (req, res) => {
  try {
    const { assetId, userId, assignedQty = 1, status } = req.body;

    const device = await AssetsDevice.findById(assetId);
    if (!device) return res.status(404).json({ message: "Device not found" });

    if (device.quality < assignedQty)
      return res.status(400).json({ message: "Not enough stock" });

    const assignment = await AssetAssignment.create({
      asset: assetId,
      assignedToUser: userId,
      assignedBy: req.user._id,
      assignedQty,
      status,
    });

    device.quality -= assignedQty;
    await device.save();

    res
      .status(201)
      .json({ message: "Asset assigned successfully", assignment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2️⃣ Get All Assigned Assets
export const getAssignedAssets = async (req, res) => {
  try {
    const assignments = await AssetAssignment.find({
      status: { $in: ["Active", "Inactive"] },
    })
      .populate("asset", "name status quantity")
      .populate("assignedToUser", "username role");

    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAssignedDefective = async (req, res) => {
  try {
    const assignments = await AssetAssignment.find({ status: "Defective" })
      .populate("asset", "name status quantity")
      .populate("assignedToUser", "username role");
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Only logged-in user's assignments
export const getAssignedAssetsForLoggedInUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const assignments = await AssetAssignment.find({
      assignedToUser: userId,
    })
      .populate("asset", "name status quantity")
      .lean();

    const result = await Promise.all(
      assignments.map(async (assignment) => {
        const request = await AssetRequest.findOne({
          assignment: assignment._id,
          requestedBy: userId,
        }).select("reqstatus reason feedback createdAt updatedAt");

        return {
          ...assignment,
          request: request
            ? {
                reqstatus: request.reqstatus,
                reason: request.reason,
                feedback: request.feedback || "-",
                createdAt: request.createdAt,
                updatedAt: request.updatedAt,
              }
            : null,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching assigned assets:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAssignedAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { assetId, userId } = req.body;

    const assignment = await AssetAssignment.findById(id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Update assignment
    assignment.asset = assetId;
    assignment.assignedToUser = userId;
    await assignment.save();

    res
      .status(200)
      .json({ message: "Assignment updated successfully", assignment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAssignedAsset = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await AssetAssignment.findById(id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    const device = await AssetsDevice.findById(assignment.asset);
    if (device) {
      device.quality += assignment.assignedQty;
      await device.save();
    }

    await assignment.deleteOne();

    res.status(200).json({ message: "Assignment deleted and stock restored" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
