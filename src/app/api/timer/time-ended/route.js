import { verifyJWT } from "@/lib/session";
import { NextResponse } from "next/server";
import login from "@/models/login";

export async function GET(request) {
  try {
    const cookies = request.cookies;
    const session = cookies.get("session");
    const { TeamId: teamID } = await verifyJWT(session?.value);
    const team = await login.findOne({ teamID });

    return NextResponse.json({ timeEnded: team.timeEnded });
  } catch (error) {
    console.error("Error in timer (end) route:", error);
    return NextResponse.json(
      { error: "Error occured in timer (end) route" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || !body.newTime) {
      return NextResponse.json({
        error: "Invalid request body for timer. Should have property: newTime",
      });
    }
    const newTime = body.newTime;
    const cookies = request.cookies;
    const session = cookies.get("session");
    const { TeamId: teamID } = await verifyJWT(session?.value);

    await login.updateOne({ teamID }, { timeEnded: newTime });
    return NextResponse.json({ message: "Time Ended updated successfully" });
  } catch (error) {
    console.error("Error in timer (end) route:", error);
    return NextResponse.json(
      { error: "Error occured in timer (end) route" },
      { status: 500 }
    );
  }
}
