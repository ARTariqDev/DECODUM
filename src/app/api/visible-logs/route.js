import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import LoginModel from '@/models/login';
import { verifyJWT } from '@/lib/session';
import { cookies } from 'next/headers';

// Map: taskId (1-based) => log titles to show when that task is answered
const taskToLogTitles = {
  // Logs 3 and 4 are always visible by default
  1: ["Log 1","Log 2"],
  2: [],
  3: ["Log [BLUR]#%@[/BLUR]"],
  4: ["Log 5"],
  5: ["Log [BLUR]#%&@[/BLUR]"],
  6: [],
  7: ["Grateful"],
  8: ["Bad People Everywhere", "Corrupt and Stupid", "I’m trying my best", "I don’t like", "Luigi"],
  9: ["????"],
  10: ["Health is Wealth"],
};

export async function GET(request) {
  try {
    const c = await cookies();
    const session = c.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifyJWT(session);
    if (!payload || !payload.TeamId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    const teamID = payload.TeamId;
    await dbConnect();
    const team = await LoginModel.findOne({ teamID: teamID }).exec();
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    // Always show logs 3 and 4 by default
    let visibleTitles = ["Log 3", "Log 4"];
    if (team.taskAnswers) {
      team.taskAnswers.forEach((value, key) => {
        if (value && value.trim() !== "") {
          const logsForTask = taskToLogTitles[Number(key)];
          if (logsForTask) visibleTitles = visibleTitles.concat(logsForTask);
        }
      });
    }
    // Remove duplicates
    visibleTitles = Array.from(new Set(visibleTitles));
    return NextResponse.json({ visibleLogTitles: visibleTitles });
  } catch (error) {
    console.error('Error retrieving visible logs:', error);
    return NextResponse.json({ error: 'Server error while retrieving visible logs' }, { status: 500 });
  }
}
