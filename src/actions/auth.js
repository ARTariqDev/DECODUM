//keeping the code for now maybe will remove later

"use server";
import { dbConnect } from "@/lib/dbConnect";
import LoginModel from "@/models/login";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const loginAction = async (prevState, formData) => {
  try {
    let data = Object.fromEntries(formData);
    data = new LoginModel(data);
    //validate the data
    let validationError = data.validateSync();
    if (validationError) {
      return {
        password: validationError.errors["password"]?.message || "",
        teamID: validationError.errors["teamID"]?.message || "",
      };
    }
    await dbConnect();

    //check for the team
    const team = await LoginModel.findOne({ teamID: data.teamID }).exec();
    if (!team || team.password !== data.password) {
      return { message: "Invalid Team Id or Password!" };
    }

    await createSession(team.teamID);
  } catch (error) {
    console.error("Login Action Error:", error);
  }
  redirect("/");
};
