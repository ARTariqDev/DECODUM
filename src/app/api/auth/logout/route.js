import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Remove the session cookie
  const c = await cookies();
  c.delete("session");
  // Optionally, clear other user-related cookies here
  return NextResponse.json({ success: true, message: "Logged out and cookie deleted" });
}
