// import LoginModel from "../models/login.js";
// import mongoose from "mongoose";
// const seedData = [
//   { teamID: "team123", password: "password123" },
//   { teamID: "team456", password: "password456" },
// ];

// async function seed() {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://artariqdev:Np12mgSbLXwyJ38Z@decodum.9k6wsgo.mongodb.net/?retryWrites=true&w=majority&appName=decodum"
//     );
//     console.log("Database connected successfully");
//     // LoginModel.insertMany(seedData)
//     //   .then(() => {
//     //     console.log("Seed data inserted successfully");
//     //   })
//     //   .catch((error) => {
//     //     console.error("Error inserting seed data:", error);
//     //   });
//     LoginModel.find({}).then((data) => {
//       console.log("Seed Data:", data);
//     });
//   } catch (error) {
//     console.error("Database connection failed:", error);
//   }
// }

// seed();
