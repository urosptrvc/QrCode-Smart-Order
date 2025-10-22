import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/src/lib/session/verifyJWT";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ✅ Allow access to /auth and /api routes
  if (path.startsWith("/auth") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  const clientTokenName = `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`;
  const sessionJwt = request.cookies.get(clientTokenName)?.value as string;

  // ✅ If no JWT, redirect to login
  if (!sessionJwt) {
    console.log("Missing session token - redirect to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ✅ Verify token
  const session = await verifyToken(sessionJwt);
  if (!session) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(clientTokenName);
    return response;
  }

  // 🔒 Restrict /admin to role=admin
  if (path.startsWith("/admin") && !session) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

// ✅ Run only on /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
