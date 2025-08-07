/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 1) JSON 파싱
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  // 2) 필드 검증 생략…

  try {
    const upstream = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // 3) 실패 시 Content-Type 검사해서 JSON이면 json()으로, 아니면 text()로
    if (!upstream.ok) {
      const ct = upstream.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const errData = await upstream.json();
        console.error('🔴 Upstream signup error (json):', errData);
        // status, message 필드가 그대로 프론트에 전달됩니다
        return NextResponse.json(errData, { status: upstream.status });
      } else {
        const text = await upstream.text();
        console.error('🔴 Upstream signup error (text):', text);
        return NextResponse.json(
          { message: text || 'Upstream error' },
          { status: upstream.status }
        );
      }
    }

    // 4) 성공 시
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('🔴 Signup proxy unexpected error:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
