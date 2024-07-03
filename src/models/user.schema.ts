import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Name should be atleast 4 characters."],
    maxLength: [60, "Name cannot exceed 60 characters."],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exist"],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please enter valid email e.g., joe@email.com",
    ],
  },
});

export default mongoose.model("User", userSchema);
