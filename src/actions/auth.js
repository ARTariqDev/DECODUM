"use server";
import { dbConnect } from "@/lib/dbConnect";
import LoginModel from "@/models/login";
import { createSession } from "@/lib/session";

export const loginAction = async (prevState, formData) => {
  try {
    await dbConnect();
    let data = Object.fromEntries(formData);

    data = new LoginModel(data);
    //validate the data
    let validationError = data.validateSync();
    if (validationError) {
      return {
        password: validationError.errors["password"].message,
        teamID: validationError.errors["teamID"].message,
      };
    }
    //check for the team
    const team = await LoginModel.findOne({ teamID: data.teamID }).exec();
    if (!team || team.password !== data.password) {
      return { message: "Invalid team Id or Password!" };
    }

    await createSession(team.teamID);
  } catch (error) {
    console.error("Login Action Error:", error);
  }
};
