import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";


export default clerkMiddleware(async (auth, req) => {
  const { userId } = await  auth();
  if (!userId) return NextResponse.next();

   const user = await users.getUser(userId);
  const meta = user?.unsafeMetadata || {};
  const isSetupDone = meta.level && meta.nickname && meta.interests;
  const pathname = req.nextUrl.pathname;

  if (!isSetupDone && pathname !== "/after") {
    return NextResponse.redirect(new URL("/after", req.url));
  }
  if (isSetupDone && pathname === "/after") {
    return NextResponse.redirect(new URL("/main", req.url));
  }
  if (["/","login"].includes(pathname)){
    return NextResponse.redirect(new URL("/main",req.url))
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
