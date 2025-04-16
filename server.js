// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require('./routes/post'); // <== Add this
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

// Database connection
connectDB();

const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.LOCAL_URL
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use('/api/products', productRoutes);
app.get("/", (req, res) => {
  res.send("Hello World from backend with Multer img" );
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
