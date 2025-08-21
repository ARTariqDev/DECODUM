import { dbConnect } from "@/lib/dbConnect";
import LoginModel from "@/models/login";
import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    let data = Object.fromEntries(formData);
    data = new LoginModel(data);
    //validate the data
    let validationError = data.validateSync();
    if (validationError) {
      return NextResponse.json(
        {
          password: validationError.errors["password"]?.message || "",
          teamID: validationError.errors["teamID"]?.message || "",
        },
        { status: 400 }
      );
    }
    await dbConnect();

    //check for the team
    const team = await LoginModel.findOne({ teamID: data.teamID }).exec();
    if (!team || team.password !== data.password) {
      return NextResponse.json(
        { message: "Invalid Team Id or Password!" },
        { status: 401 }
      );
    }

    await createSession(team.teamID);
  } catch (error) {
    console.error("Login Action Error:", error);
    return NextResponse.json(
      { message: "An error occurred during login." },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: "Login successful!" }, { status: 200 });
}
