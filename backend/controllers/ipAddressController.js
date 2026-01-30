import IpAddress from "../models/IPAddress.js";

export const sendIPAddress = async (req, res) => {
  try {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({ message: "IP Address is required" });
    }

    const exists = await IpAddress.findOne({ ip });
    if (exists) {
      return res.status(400).json({ message: "IP already exists" });
    }

    const newIp = new IpAddress({ ip });
    await newIp.save();

    res.status(201).json(newIp); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIPAddress = async (req, res) => {
  try {
    const ipList = await IpAddress.find().sort({ createdAt: -1 });
    res.status(200).json(ipList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIPAddress = async (req, res) => {
  try {
    const { ip } = req.body;
    const { id } = req.params;

    if (!ip) {
      return res.status(400).json({ message: "IP Address is required" });
    }

    const updatedIp = await IpAddress.findByIdAndUpdate(
      id,
      { ip },
      { new: true }
    );

    res.status(200).json(updatedIp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};