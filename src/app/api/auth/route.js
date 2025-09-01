import { dbConnect } from "@/lib/dbConnect";
import LoginModel from "@/models/login";
import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { checkPass } from "@/lib/hasher";

export async function POST(request) {
  try {
    const formData = await request.formData();
    let data = Object.fromEntries(formData);
    data = new LoginModel(data);

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


    const team = await LoginModel.findOne({ teamID: data.teamID }).exec();
    const isAuthenticated =
      team && (await checkPass(data.password, team.password));
    if (!isAuthenticated) {
      return NextResponse.json(
        { message: "Invalid Team Id or Password!" },
        { status: 401 }
      );
    }

    await createSession(team.teamID);
    console.log("Session created successfully for team:", team.teamID);
  } catch (error) {
    console.error("Login Action Error:", error);
    return NextResponse.json(
      { message: "An error occurred during login." },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: "Login successful!" }, { status: 200 });
}
