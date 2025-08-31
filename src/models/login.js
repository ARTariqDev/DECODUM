import mongoose, { Schema } from "mongoose";

const loginSchema = new Schema({
  teamID: {
    type: String,
    required: [true, "Team ID is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  score: {
    type: Number,
    min: [0, "Score cannot be negative"],
    default: 0,
  },
});

export default mongoose.models.Login || mongoose.model("Login", loginSchema);
