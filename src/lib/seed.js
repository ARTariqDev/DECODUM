import LoginModel from "../models/login.js";
import { hashPassword, checkPass } from "./hasher.js";
import mongoose from "mongoose";
const seedData = [
  { teamID: "team123", password: "password123" },
  { teamID: "team456", password: "password456" },
];

// const hashedData = await Promise.all(
//   seedData.map(async (data) => {
//     const hash = await hashPassword(data.password);
//     return { ...data, password: hash };
//   })
// );

async function seed() {
  try {
    await mongoose.connect(
      "mongodb+srv://artariqdev:Np12mgSbLXwyJ38Z@decodum.9k6wsgo.mongodb.net/?retryWrites=true&w=majority&appName=decodum"
    );
    console.log("Database connected successfully");

    // LoginModel.deleteMany({}).then((data) => {
    //   console.log("Deleted");
    //   console.log(data);
    // });
    // await LoginModel.insertMany(hashedData);
    LoginModel.find({}).then((data) => console.log(data));
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// seed();
