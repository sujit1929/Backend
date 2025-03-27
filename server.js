const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration: Aap production mein frontend URL update kar sakte hain
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON parsing middleware
app.use(express.json());

// Mongoose connection using environment variable (MONGO_URI must be set in Vercel)

mongoose
  .connect("mongodb+srv://Sujeet:mongo785999@cluster0.car0p.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));


// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
});

// Create User Model (Collection: 'users')
const User = mongoose.model("users", userSchema);
//Hello mongo

// API to fetch all users
app.get("/", (req, res) => {
  res.send("Hello World!");
})
app.get("/auth/sign-up", (req, res) => {
  res.send("Hello World! from sign-up");
})
app.get("/users", async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// API to fetch user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (user) {
      res.json({ message: "✅ User fetched successfully!", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// API to register user(s)sujit
app.post("/auth/sign-up", async (req, res) => {
  try {
    // Check if multiple users are sent as array
    if (Array.isArray(req.body)) {
      const usersData = req.body;
      const insertedUsers = [];

      for (const userData of usersData) {
        const { name, email, password, mobile } = userData;

        if (!name || !email || !password || !mobile) {
          return res
            .status(400)
            .json({ message: "All fields are required for each user" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: `Email ${email} already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, mobile });
        await user.save();
        insertedUsers.push(user);
      }

      return res
        .status(201)
        .json({ message: "✅ Users registered successfully!", users: insertedUsers });
    } else {
      // Process single user registration
      const { name, email, password, mobile } = req.body;
      if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, mobile });
      await user.save();

      return res
        .status(201)
        .json({ message: "✅ User registered successfully!", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ Internal Server Error", error: error.message });
  }
});

// API to login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ message: "✅ Login successful!", user });
    } else {
      res.status(400).json({ message: "Email or password is incorrect!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// API to update a user
app.patch("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, email, password, mobile } = req.body;
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) existingUser.name = name;
    if (email) existingUser.email = email;
    if (password) existingUser.password = await bcrypt.hash(password, 10);
    if (mobile) existingUser.mobile = mobile;

    await existingUser.save();
    res.status(200).json({ message: "✅ User updated successfully!", user: existingUser });
  } catch (error) {
    res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
  }
});

// API to delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
  }
});

// // Fallback route: Agar koi route match na kare toh 404 JSON return karein
// app.all("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});  