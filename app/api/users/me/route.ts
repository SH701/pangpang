/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { koreanLevel, interests, profileImageUrl } = body;
  if (
    typeof koreanLevel !== 'string' ||
    !Array.isArray(interests) ||
    typeof profileImageUrl !== 'string'
  ) {
    return NextResponse.json(
      { message: 'Missing or invalid fields' },
      { status: 400 }
    );
  }

  try {
  // Next.js의 req.cookies API 사용
  const sessionCookie = req.cookies.get('__session')?.value;
  const accessToken = req.cookies.get('accessToken')?.value;

  // 전달할 헤더 객체 구성
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (sessionCookie) {
    headers['cookie'] = `__session=${sessionCookie}`;
  }
  if (accessToken) {
    headers['authorization'] = `Bearer ${accessToken}`;
  }

  const upstream = await fetch('http://localhost:8080/api/users/me', {
    method: 'GET',
    headers,
    body: JSON.stringify({ koreanLevel, interests, profileImageUrl }),
  });

  if (!upstream.ok) {
    const errData = await upstream.json().catch(() => null);
    return NextResponse.json(
      { message: errData?.message || `Backend error ${upstream.status}` },
      { status: upstream.status }
    );
  }

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
} catch (err) {
  console.error('/api/profile proxy error', err);
  return NextResponse.json(
    { message: 'Internal Server Error' },
    { status: 500 }
  );
}
}
