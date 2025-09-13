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
  mazeProgress: {
    type: Number,
    min: [0, "Maze progress cannot be negative"],
    default: 0,
  },
  currentTaskIndex: {
    type: Number,
    min: [0, "Task index cannot be negative"],
    default: 0,
  },
  taskAnswers: {
    type: Map,
    of: String,
    default: new Map(),
  },
  timeStarted: {
    type: Number,
    default: null,
  },
  timeEnded: {
    type: Number,
    default: null,
  },
});

export default mongoose.models.Login || mongoose.model("Login", loginSchema);
