import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/session";


const protectedRoutes = ["/tasks"];

const publicRoutes = ["/login"];

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const session = req.cookies.get("session")?.value;
  const payload = session ? await verifyJWT(session) : null;

  // Redirect unauthenticated users trying to access protected routes
  if (protectedRoutes.includes(path) && !payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from login page
  if (publicRoutes.includes(path) && payload) {
    return NextResponse.redirect(new URL("/tasks", req.url));
  }


  if (path === "/" && payload) {
    return NextResponse.redirect(new URL("/tasks", req.url));
  }

  return NextResponse.next();
}

// a matcher to run middleware on all routes
export const config = {
  matcher: ["/", "/login", "/tasks"],
};
