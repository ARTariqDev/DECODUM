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
});

export default mongoose.models.Login || mongoose.model("Login", loginSchema);
