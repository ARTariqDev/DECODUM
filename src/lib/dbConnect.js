import mongoose from "mongoose";

let isConected = false;

export async function dbConnect() {
  if (isConected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
    isConected = true;
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
