// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require('./routes/post'); // <== Add this
dotenv.config();
const app = express();

// Database connection
connectDB();

const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL ,
  // origin: process.env.LOCAL_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
console.log(process.env.LOCAL_URL)
// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use('/', postRoutes);
app.get("/", (req, res) => {
  res.send("Hello World from backend with post apis with tenstack" );
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
