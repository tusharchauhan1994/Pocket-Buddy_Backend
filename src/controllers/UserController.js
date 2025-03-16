const userModel = require("../models/UserModel");
const roleModel = require("../models/RoleModel"); // Import Role Model
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");

const signup = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    const { firstName, lastName, email, password, roleId } = req.body;

    // ✅ Validate Required Fields
    if (!firstName || !lastName || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required (firstName, lastName, email, password, roleId)" });
    }

    // ✅ Check if Email is Already Registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Hash Password for Security
    const hashedPassword = bcrypt.hashSync(password, 10);

    // ✅ Get the Role from the Database
    console.log("Role ID from request:", roleId);
    const role = await roleModel.findById(roleId);
    if (!role) {
      console.error("Invalid roleId, no role found in database!");
      return res.status(400).json({ message: "Invalid roleId" });
    }
    console.log("Fetched Role from Database:", role);

    // ✅ Format Name Properly
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // ✅ Create the New User in Database
    const newUser = await userModel.create({
      firstName,
      lastName,
      name: fullName,  // ✅ Store full name
      email,
      password: hashedPassword,
      roleId,
    });

    console.log("Newly Created User:", newUser);
    console.log("User Role:", role.name);

    // ✅ Define Role-Specific Welcome Message
    let roleMessage = "";
    if (role.name.toLowerCase() === "admin") {
      roleMessage = "You have been registered as an Admin. Manage users and settings.";
    } else if (role.name.toLowerCase() === "restaurant") {
      roleMessage = "You have been registered as a Restaurant. Start adding your offers!";
    } else {
      roleMessage = "You have been registered as a User. Start exploring restaurants!";
    }

    // ✅ Construct Welcome Email
    const welcomeMessage = `
Hello ${fullName}, 👋

Welcome to Pocket Buddy! 🎉

${roleMessage}

Here’s what you can do next:
✅ Explore your dashboard  
✅ Set up your profile  
✅ Start creating and managing offers (if applicable)  

If you have any questions, feel free to reach out to our support team.

Happy exploring! 🚀  

Best regards,  
The Pocket Buddy Team
`;

    // ✅ Send Welcome Email
    await mailUtil.sendingMail(email, "Welcome to Pocket Buddy!", welcomeMessage);

    // ✅ Return Success Response
    res.status(201).json({ message: "User registered and welcome email sent!", data: newUser });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup error", error: err });
  }
};


const loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email }).populate("roleId");
    if (!user) return res.status(404).json({ message: "Email not found" });

    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

// Add a new user
const addUser = async (req, res) => {
  const savedUser = await userModel.create(req.body);
  res.json({
    message: "User saved successfully",
    data: savedUser,
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate("roleId");

    console.log("🔍 Raw Users from Database:", users); // Debugging

    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: (user.firstName && user.lastName) 
        ? `${user.firstName} ${user.lastName}`.trim() 
        : user.firstName 
          ? user.firstName 
          : user.lastName 
            ? user.lastName 
            : user.name 
              ? user.name
              : "No Name",  // ✅ Final fallback
      email: user.email,
      role: user.roleId?.name || "N/A",
      status: user.status ? "Active" : "Inactive",
    }));

    console.log("✅ Formatted Users Sent to Frontend:", formattedUsers);

    res.json({ message: "Users fetched successfully", data: formattedUsers });

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};





// Get user by ID
const getUserById = async (req, res) => {
  const foundUser = await userModel.findById(req.params.id);
  res.json({
    message: "User fetched successfully",
    data: foundUser,
  });
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  const deletedUser = await userModel.findByIdAndDelete(req.params.id);
  res.json({
    message: "User deleted successfully",
    data: deletedUser,
  });
};

// Export all functions
module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signup,
  loginUser,
};
