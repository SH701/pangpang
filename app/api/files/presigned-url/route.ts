// app/api/files/presigned-url/route.ts
import { NextResponse } from 'next/server';

// 1) 프리플라이트 요청 처리
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin',  '*');                
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

// 2) 실제 POST 요청
export async function POST(request: Request) {
  // CORS 헤더 미리 붙여두기
  const resHeaders = new Headers({
    'Access-Control-Allow-Origin': '*',               
  });

  // 1) Authorization 헤더 확인
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ message: 'Not authenticated' }),
      { status: 401, headers: resHeaders }
    );
  }
  const token = auth.slice(7);

  // 2) Spring upstream 으로 토큰 + body 포워딩
  let upstream: Response;
  try {
    upstream = await fetch('http://localhost:8080/api/files/presigned-url', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body:    await request.text(),
    });
  } catch (e) {
    console.error('Upstream fetch error', e);
    return new NextResponse(
      JSON.stringify({ message: 'Upstream fetch failed' }),
      { status: 502, headers: resHeaders }
    );
  }

  // 3) Spring 에러 전파
  if (!upstream.ok) {
    const text = await upstream.text();
    console.error('Upstream returned error:', upstream.status, text);
    return new NextResponse(
      JSON.stringify({ message: `Upstream error: ${text}` }),
      { status: upstream.status, headers: resHeaders }
    );
  }

  // 4) presign URL 파싱 후 리턴
  const data = await upstream.json();
  if (!data.url) {
    console.error('No URL in upstream response', data);
    return new NextResponse(
      JSON.stringify({ message: 'No URL returned' }),
      { status: 502, headers: resHeaders }
    );
  }

  return new NextResponse(
    JSON.stringify({ url: data.url }),
    { status: 200, headers: resHeaders }
  );
}
