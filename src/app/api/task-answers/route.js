import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import LoginModel from '@/models/login';
import { verifyJWT } from '@/lib/session';
import { cookies } from 'next/headers';

// GET - Retrieve all task answers for the authenticated team
export async function GET(request) {
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

    const teamID = payload.TeamId;

    await dbConnect();
    const team = await LoginModel.findOne({ teamID: teamID }).exec();
    
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Convert Map to object for JSON response
    const answers = {};
    if (team.taskAnswers) {
      team.taskAnswers.forEach((value, key) => {
        answers[key] = value;
      });
    }

    return NextResponse.json({
      taskAnswers: answers,
      mazeProgress: team.mazeProgress,
      currentTaskIndex: team.currentTaskIndex
    });

  } catch (error) {
    console.error('Error retrieving task answers:', error);
    return NextResponse.json(
      { error: 'Server error while retrieving answers' },
      { status: 500 }
    );
  }
}

// POST - Save or update a task answer
export async function POST(request) {
  console.log('--- POST /api/task-answers called ---');
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

    const teamID = payload.TeamId;
    let taskId, answer;
    try {
      const body = await request.json();
      taskId = body.taskId;
      answer = body.answer;
      console.log('Received:', { taskId, answer });
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid or empty JSON body' },
        { status: 400 }
      );
    }

    if (taskId === undefined || taskId === null) {
      return NextResponse.json(
        { error: 'Missing taskId' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Get current team data
    const currentTeam = await LoginModel.findOne({ teamID: teamID }).exec();
    if (!currentTeam) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Prepare the update object
    const updateObj = {};
    // Handle answer save/clear
    if (answer && answer.trim()) {
      // Save answer
      updateObj[`taskAnswers.${taskId}`] = answer.trim();
    } else {
      // Clear answer
      updateObj.$unset = { [`taskAnswers.${taskId}`]: "" };
    }
    console.log('Update object:', updateObj);

    // Calculate new progress based on answered tasks
    const currentAnswers = currentTeam.taskAnswers || new Map();
    let newAnswerCount = 0;
    if (answer && answer.trim()) {
      // Adding/updating an answer
      const answersWithNew = new Map(currentAnswers);
      answersWithNew.set(taskId.toString(), answer.trim());
      newAnswerCount = answersWithNew.size;
    } else {
      // Removing an answer
      const answersWithoutThis = new Map(currentAnswers);
      answersWithoutThis.delete(taskId.toString());
      newAnswerCount = answersWithoutThis.size;
    }

    // Update maze progress and current task index based on answered tasks
    const newMazeProgress = Math.min(newAnswerCount, 11);
    const newCurrentTaskIndex = Math.min(newAnswerCount, 10);

    if (!updateObj.$unset) {
      updateObj.mazeProgress = newMazeProgress;
      updateObj.currentTaskIndex = newCurrentTaskIndex;
    } else {
      updateObj.$set = {
        mazeProgress: newMazeProgress,
        currentTaskIndex: newCurrentTaskIndex
      };
    }

    // Resume timer logic (if needed)
    const teamBeforeUpdate = await LoginModel.findOne({ teamID: teamID }).exec();
    if (teamBeforeUpdate.timeStarted && teamBeforeUpdate.timeEnded) {
      const timeUsed = Math.floor((teamBeforeUpdate.timeEnded - teamBeforeUpdate.timeStarted) / 1000);
      if (timeUsed < 7200) {
        // Resume timer: set new start, clear end
        const now = Date.now();
        await LoginModel.updateOne(
          { teamID: teamID },
          { $set: { timeStarted: now, timeEnded: null } }
        );
      }
      // else: timer is over, do not reset
    }

    // Actually update the answer/maze progress
    await LoginModel.updateOne({ teamID: teamID }, updateObj);
    // Fetch updated team after answer update
    const updatedTeam = await LoginModel.findOne({ teamID: teamID }).exec();
    console.log('Updated team:', updatedTeam);

    if (!updatedTeam) {
      return NextResponse.json(
        { error: 'Failed to update team' },
        { status: 500 }
      );
    }

    // Convert Map to object for response
    const answers = {};
    if (updatedTeam.taskAnswers) {
      updatedTeam.taskAnswers.forEach((value, key) => {
        answers[key] = value;
      });
    }

    return NextResponse.json({
      success: true,
      taskAnswers: answers,
      mazeProgress: updatedTeam.mazeProgress,
      currentTaskIndex: updatedTeam.currentTaskIndex
    });

  } catch (error) {
    console.error('Error saving task answer:', error);
    return NextResponse.json(
      { error: 'Server error while saving answer' },
      { status: 500 }
    );
  }
}
