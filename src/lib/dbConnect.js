import mongoose from "mongoose";

let isConected = false;

export async function dbConnect() {
  if (isConected) return;
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/signin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
    isConected = true;
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
