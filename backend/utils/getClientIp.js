import axios from "axios";

export const getClientIp = async (req) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }


  if (ip === "::1" || ip === "127.0.0.1") {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      ip = response.data.ip;
    } catch (err) {
      console.log("Failed to fetch public IP:", err.message);
      ip = "Dev_LOCAL";
    }
  }

  return ip;
};

