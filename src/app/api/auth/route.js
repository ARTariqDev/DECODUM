import { dbConnect } from "@/lib/dbConnect";
import LoginModel from "@/models/login";
import { createSession, verifyJWT } from "@/lib/session";
import { NextResponse } from "next/server";
import { checkPass } from "@/lib/hasher";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const c = await cookies();
    const session = c.get('session')?.value;
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(session);
    if (!payload || !payload.TeamId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get team data including progress from database
    await dbConnect();
    const team = await LoginModel.findOne({ teamID: payload.TeamId }).exec();
    
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      teamId: payload.TeamId,
      authenticated: true,
      mazeProgress: team.mazeProgress || 0,
      currentTaskIndex: team.currentTaskIndex || 0
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 401 }
    );
  }
}

export async function PUT(request) {
  try {
    const { teamID, incrementScore } = await request.json();

    if (!teamID || !incrementScore) {
      return NextResponse.json(
        { message: "Team ID and incrementScore are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find and increment the team's score
    const team = await LoginModel.findOneAndUpdate(
      { teamID: teamID },
      { $inc: { score: 1 } },
      { new: true }
    ).exec();

    if (!team) {
      return NextResponse.json(
        { message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Score updated successfully", newScore: team.score },
      { status: 200 }
    );
  } catch (error) {
    console.error("Score update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating score" },
      { status: 500 }
    );
  }
}

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
