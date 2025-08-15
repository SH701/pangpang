import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const baseUrl = process.env.API_URL || "http://localhost:8080";
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  try {
    const res = await fetch(`${baseUrl}/api/users/me`, {
  headers: { Authorization: `Bearer ${token}` },
});

    if (!res.ok) throw new Error("User fetch failed");
    const user = await res.json();

    if (!user.koreanLevel) {
      return NextResponse.redirect(new URL("/after", req.url));
    }

    if (req.nextUrl.pathname === "/after") {
      return NextResponse.redirect(new URL("/main", req.url));
    }
  } catch (e) {
    console.error("Middleware error:", e);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// 보호할 경로 설정
export const config = {
  matcher: ["/main/:path*", "/after"],
};
