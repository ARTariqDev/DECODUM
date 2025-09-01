import { NextResponse } from 'next/server';
import { checkPass } from '@/lib/hasher';
import { dbConnect } from '@/lib/dbConnect';
import LoginModel from '@/models/login';
import { verifyJWT } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request) {
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
    const { userAnswer, hashedAnswers } = await request.json();

    if (!userAnswer || !hashedAnswers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let isCorrect = false;
    for (const hashedAnswer of hashedAnswers) {
      const matches = await checkPass(userAnswer.toLowerCase().trim(), hashedAnswer);
      if (matches) {
        isCorrect = true;
        break;
      }
    }

    if (isCorrect) {
      await dbConnect();
      const currentTeam = await LoginModel.findOne({ teamID: teamID }).exec();
      if (!currentTeam) {
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 404 }
        );
      }

      // Calculate new task index (don't exceed 10, which is the last task index for 11 tasks)
      const newTaskIndex = Math.min(currentTeam.currentTaskIndex + 1, 10);
      
      const team = await LoginModel.findOneAndUpdate(
        { teamID: teamID },
        { 
          $inc: { score: 1, mazeProgress: 1 },
          $set: { currentTaskIndex: newTaskIndex }
        },
        { new: true }
      ).exec();

      if (!team) {
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        correct: true,
        message: 'Correct answer!',
        newScore: team.score,
        newMazeProgress: team.mazeProgress,
        newTaskIndex: team.currentTaskIndex
      });
    } else {
      return NextResponse.json({
        correct: false,
        message: 'Incorrect answer. Try again!'
      });
    }

  } catch (error) {
    console.error('Answer check error:', error);
    return NextResponse.json(
      { error: 'Server error while checking answer' },
      { status: 500 }
    );
  }
}
