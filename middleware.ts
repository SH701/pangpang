/* eslint-disable @typescript-eslint/no-explicit-any */
import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/sign-in'];

function isPublicRoute(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function redirectToSignIn(requestUrl: string, error: string) {
  const url = new URL('/sign-in', requestUrl);
  url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}


export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId } = await auth();
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!userId) {
    if (isPublicRoute(pathname)) return NextResponse.next();
    return redirectToSignIn(request.url, 'no-auth');
  }

  if (pathname === '/') {
    let levelSet = false;
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      levelSet = !!((user.unsafeMetadata as any)?.levelSet);
    } catch (e) {
      const onboarded = request.cookies.get('onboarded')?.value;
      if (onboarded === 'true') levelSet = true;
    }

    if (levelSet) {
      return NextResponse.redirect(new URL('/main', url.origin));
    } else {
      return NextResponse.redirect(new URL('/greet', url.origin));
    }
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
