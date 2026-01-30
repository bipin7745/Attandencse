import AssetsDevice from "../models/AssetsDevice.js";


export const createDevice = async (req, res) => {
  const { name, quality } = req.body;

  if (!name || !quality) {
    return res.status(400).json({ message: "All Fildes are required" });
  }
   
  if (quality < 1) {
    return res.status(400).json({ message: "Quality must be at least 1" });
  }

  try {
    const newDevice = new AssetsDevice({ name, quality }); 
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDevices = async (req, res) => {
  try {
    const devices = await AssetsDevice.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const device = await AssetsDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ message: "Device not found" });
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const updatedDevice = await AssetsDevice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDevice) return res.status(404).json({ message: "Device not found" });
    res.status(200).json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE device by ID
export const deleteDevice = async (req, res) => {
  try {
    const deletedDevice = await AssetsDevice.findByIdAndDelete(req.params.id);
    if (!deletedDevice) return res.status(404).json({ message: "Device not found" });
    res.status(200).json({ message: "Device deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
