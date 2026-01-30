// import mongoose from "mongoose";

// const IPAddressSchema = new mongoose.Schema(
//   {
//     ip: {
//       type: String,
//       required: true,
//       unique: true
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("IpAddress", IPAddressSchema);
// import IpAddress from "../models/IpAddress.js";

// /* SAVE IP ADDRESS */
// export const saveIpAddress = async (req, res) => {
//   try {
//     const { ip } = req.body;

//     const exists = await IpAddress.findOne({ ip });
//     if (exists) {
//       return res.status(400).json({ message: "IP already exists" });
//     }

//     const newIp = new IpAddress({ ip });
//     await newIp.save();

//     res.status(201).json({ message: "IP saved successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* LOGIN CHECK */
// export const loginWithIp = async (req, res) => {
//   try {
//     const userIp =
//       req.headers["x-forwarded-for"] ||
//       req.socket.remoteAddress;

//     const ip = userIp.replace("::ffff:", "");

//     const validIp = await IpAddress.findOne({ ip });

//     if (!validIp) {
//       return res.status(401).json({ message: "IP not allowed to login" });
//     }

//     res.status(200).json({ message: "Login success", ip });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// import express from "express";
// import { saveIpAddress, loginWithIp } from "../controllers/ipController.js";

// const router = express.Router();

// router.post("/save-ip", saveIpAddress);
// router.post("/login", loginWithIp);

// export default router;
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import ipRoutes from "./routes/ipRoutes.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/iplogin");

// app.use("/api/ip", ipRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const saveIp = createAsyncThunk("ip/save", async (ip) => {
//   const res = await axios.post("http://localhost:5000/api/ip/save-ip", { ip });
//   return res.data;
// });

// export const loginIp = createAsyncThunk("ip/login", async () => {
//   const res = await axios.post("http://localhost:5000/api/ip/login");
//   return res.data;
// });

// const ipSlice = createSlice({
//   name: "ip",
//   initialState: { message: "", error: "" },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(saveIp.fulfilled, (state, action) => {
//         state.message = action.payload.message;
//       })
//       .addCase(loginIp.fulfilled, (state, action) => {
//         state.message = action.payload.message;
//       })
//       .addCase(loginIp.rejected, (state) => {
//         state.error = "Not allowed to login";
//       });
//   },
// });

// export default ipSlice.reducer;
// import { configureStore } from "@reduxjs/toolkit";
// import ipReducer from "./ipSlice";

// export const store = configureStore({
//   reducer: {
//     ip: ipReducer,
//   },
// });
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { saveIp } from "../redux/ipSlice";

// export default function IPAddress() {
//   const [ip, setIp] = useState("");
//   const dispatch = useDispatch();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(saveIp(ip));
//   };

//   return (
//     <div className="auth-container">
//       <h1>Save IP Address</h1>
//       <form onSubmit={submitHandler}>
//         <input
//           type="text"
//           placeholder="Enter IP Address"
//           value={ip}
//           onChange={(e) => setIp(e.target.value)}
//         />
//         <button type="submit">Save</button>
//       </form>
//     </div>
//   );
// }

// function getLocalIp() {
//   const interfaces = os.networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const iface of interfaces[name]) {
//       if (iface.family === "IPv4" && !iface.internal) {
//         return iface.address;
//       }
//     }
//   }
//   return null;
// }
// export const loginUser = async (req, res) => {
//   try {
//     // ------------------------------
//     // Step 1: Get email and password
//     // ------------------------------
//     const { email, password } = req.body;

//     // Step 2: Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User Email Invalid" });
//     }

//     // Step 3: Check if password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "User Password Invalid" });
//     }

//     // ------------------------------
//     // Step 4: Detect client IP dynamically
//     // ------------------------------
//     let clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "";

//     // If multiple IPs (behind proxy), take the first
//     if (clientIp.includes(",")) {
//       clientIp = clientIp.split(",")[0].trim();
//     }

//     // Handle IPv6-mapped IPv4
//     if (clientIp.startsWith("::ffff:")) {
//       clientIp = clientIp.replace("::ffff:", "");
//     }

//     // If loopback (::1 or 127.0.0.1), replace with real LAN IP
//     if (clientIp === "::1" || clientIp === "127.0.0.1") {
//       const lanIp = getLocalIp();
//       if (lanIp) clientIp = lanIp;
//     }

//     console.log("Remote address:", req.connection.remoteAddress);
//     console.log("Final client IP detected:", clientIp);

//     const isLocalNetwork = clientIp.startsWith("192.168.") || clientIp.startsWith("10.");
//     let ipExists = null;
//     if (!isLocalNetwork) {
//       ipExists = await IpAddress.findOne({ ip: clientIp });
//     }

//     if (!isLocalNetwork && !ipExists) {
//       console.log("Unauthorized IP attempt:", clientIp);
//       return res.status(403).json({
//         message: "You are not authorized to login from this IP",
//       });
//     }

//     console.log("Authorized login IP:", clientIp);

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     return res.status(200).json({
//       message: "User Login Successfully",
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//         token,
//       },
//       ip: clientIp, // return the real client IP
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

import express from "express";
import multer from "multer";
import fs from "fs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db(process.env.DB_NAME);

// Multer setup for multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Add book route with multiple file upload
app.post("/books", upload.array("images", 10), async (req, res) => {
  try {
    const { title, author, genre, year } = req.body;
    if (!title || !author || !genre || !year) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Map uploaded files to URLs
    const imageUrls = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const newBook = { title, author, genre, year: Number(year), images: imageUrls };

    const result = await db.collection(process.env.COLLECTION_NAME).insertOne(newBook);

    res.status(201).json({ message: "Book added", book: { _id: result.insertedId, ...newBook } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Add book failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

import { useState } from "react";
import axios from "axios";
import backend_url from "../api_url";
import { toast } from "react-toastify";

export default function AddBook({ refreshBooks }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !author || !genre || !year)
      return toast.error("All fields required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("year", year);

    // Append multiple files
    images.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      await axios.post(`${backend_url}/books`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book added successfully");
      refreshBooks();
      setShow(false);
      setTitle("");
      setAuthor("");
      setGenre("");
      setYear("");
      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-success" onClick={() => setShow(true)}>
        Add Book
      </button>

      {show && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Add Book</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShow(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
