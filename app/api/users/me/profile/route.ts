/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  // 1) JSON 파싱
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { nickname,birthDate,koreanLevel, profileImageUrl, interests } = body;

  try {
    // 3) 인증 쿠키/토큰 포워딩
      
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    const sessionCookie = req.cookies.get('__session')?.value;
  if (sessionCookie) {
    headers['cookie'] = `__session=${sessionCookie}`;
  }
    const incomingAuth = req.headers.get('authorization');
  if (incomingAuth) {
    headers['authorization'] = incomingAuth;
  }

    // 4) Spring 백엔드 호출
    const upstream = await fetch('http://localhost:8080/api/users/me/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nickname,birthDate,koreanLevel, profileImageUrl, interests }),
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
