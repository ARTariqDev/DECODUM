import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/session";

const protectedRoutes = [""];
const publicRoutes = ["/login", "/"];

export async function middleware(req) {
  const path = req.nextUrl.pathname; //gives the path of the request
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const session = req.cookies.get("session")?.value;
  const payload = session ? await verifyJWT(session) : null;

  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  //commenting this until we make more pages
  //   if (isPublicRoute && payload) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  return NextResponse.next();
}

//user will be redirected to the login page even if they try to go to home page
// i think the home page should be linked to the first question.
// to change this, remove the home page from the protected routes
