/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/users/me/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  // 1) JSON 파싱
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { nickname, birthDate, koreanLevel, profileImageUrl, interests } = body;
  // 2) 필수 필드 검증
  if (
    typeof nickname !== 'string' ||
    typeof birthDate !== 'string' ||
    typeof koreanLevel !== 'string' ||
    typeof profileImageUrl !== 'string' ||
    !Array.isArray(interests)
  ) {
    return NextResponse.json(
      { message: 'Missing or invalid fields' },
      { status: 400 }
    );
  }

  try {
    // 3) 인증 쿠키/토큰 포워딩
    const sessionCookie = req.cookies.get('__session')?.value;
    const accessToken   = req.cookies.get('accessToken')?.value;
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (sessionCookie) headers['cookie'] = `__session=${sessionCookie}`;
    if (accessToken)   headers['authorization'] = `Bearer ${accessToken}`;

    // 4) Spring 백엔드 호출
    const upstream = await fetch('http://localhost:8080/api/users/me/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nickname, birthDate, koreanLevel, profileImageUrl, interests }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      let message = text;
      try {
        message = JSON.parse(text).message || text;
      } catch {}
      return NextResponse.json({ message }, { status: upstream.status });
    }

    // 5) 성공 시 그대로 반환
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('Profile proxy error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
