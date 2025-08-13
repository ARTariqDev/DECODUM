import { NextResponse } from "next/server";

export function middleware(req) {
  const protectedRoutes = [""];
  const publicRoutes = ["/login", "/"];
  const path = req.nextUrl.pathname; //gives the path of the request
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  return NextResponse.next();
}
