import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/session";


const protectedRoutes = ["/tasks","/logs"];

const publicRoutes = ["/login"];

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const session = req.cookies.get("session")?.value;
  console.log(`Middleware: ${path}, session exists: ${!!session}`);
  
  const payload = session ? await verifyJWT(session) : null;
  console.log(`Middleware: payload exists: ${!!payload}`);

  // Redirect unauthenticated users trying to access protected routes
  if (protectedRoutes.includes(path) && !payload) {
    console.log(`Redirecting to login from ${path}`);
    return NextResponse.redirect(new URL("/login", req.url));
  }


  if (publicRoutes.includes(path) && payload) {
    console.log(`Redirecting to tasks from ${path}`);
    return NextResponse.redirect(new URL("/tasks", req.url));
  }


  if (path === "/" && payload) {
    console.log(`Redirecting to tasks from root`);
    return NextResponse.redirect(new URL("/tasks", req.url));
  }

  return NextResponse.next();
}

// a matcher to run middleware on all routes
export const config = {
  matcher: ["/", "/login", "/tasks"],
};
