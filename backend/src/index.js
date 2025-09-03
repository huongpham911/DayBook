const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
// CORS configuration for multiple environments
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:8080',
  'http://localhost:5173',
  'https://hai.ttmmo.com'
].filter(Boolean);

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this application does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true 
}));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const entryRoutes = require("./routes/entryRoutes");

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "DayBook API is running", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/entries", entryRoutes);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}!`);
    });
  })
  .catch((error) => {
    console.log("Database not connected! " + error);
  });
