const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // अपने फ्रंटएंड के URL का उपयोग करें
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  credentials: true
}));


// Express JSON Middleware for parsing JSON data
app.use(express.json());

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
});

// Create User Model (Collection Name is 'users')
const User = mongoose.model("users", userSchema);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://Sujeet:mongo785999@cluster0.car0p.mongodb.net/Userdatabase",
    {
      serverSelectionTimeoutMS: 5000, // 5 seconds
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// API to Fetch All Users
app.get("/users", async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// API to Fetch User by ID
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


//API to Fetch User by ID as well as Slug
// app.get("/users/:id/:slug", async (req, res) => {
//   try {
//     const { id, slug } = req.params;
//     const user = await User.findById(id);

//     if (user) {
      // अगर slug गलत है, तो सही URL पर redirect करें
//       if (user.slug !== slug) {
//         return res.redirect(`/users/${id}/${user.slug}`);
//       }
//       res.json({ message: "✅ User found!", user });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// API to Create User(s) (POST request)
app.post("/register", async (req, res) => {
  try {
    // Check if req.body is an array (multiple records)
    if (Array.isArray(req.body)) {
      const usersData = req.body;
      const insertedUsers = [];

      for (const userData of usersData) {
        const { name, email, password, mobile } = userData;

        // Validate each user object
        if (!name || !email || !password || !mobile) {
          return res
            .status(400)
            .json({ message: "All fields are required for each user" });
        }

        // Check for existing user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: `Email ${email} already exists` });
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
      // Process single record registration
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
    res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
  }
});


// // API to Create a User (POST request)
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, mobile } = req.body;

//     if (!name || !email || !password || !mobile) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ name, email, password: hashedPassword, mobile });
//     await user.save();

//     res.status(201).json({ message: "✅ User registered successfully!", user });
//   } catch (error) {
//     res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
//   }
// });

// API to Login
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

// API to Update a User (PATCH request)
app.patch("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, email, password, mobile } = req.body;

    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Conditionally update fields
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

// API to Delete a User (DELETE request)
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

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
