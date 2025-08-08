import { NextRequest, NextResponse } from 'next/server';

// 공통: 인증 헤더/쿠키 추출
export async function GET(req: NextRequest) {
  try {
    // 1) 인증 헤더/쿠키 준비
    const headers: Record<string,string> = {};
    const auth = req.headers.get('authorization');
    if (auth) headers['authorization'] = auth;
    const sess = req.cookies.get('__session')?.value;
    if (sess) headers['cookie'] = `__session=${sess}`;

    // 2) 실제 백엔드 호출
    const upstream = await fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      headers,
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      let msg = text;
      try { msg = JSON.parse(text).message; } catch {}
      return NextResponse.json({ message: msg }, { status: upstream.status });
    }

    // 빈 바디 방지
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('GET /api/users/me/profile proxy error', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
