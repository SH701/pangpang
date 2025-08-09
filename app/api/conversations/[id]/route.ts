import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:8080';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization'); // 'Bearer xxxxx'
    if (!token) {
      return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
    }

    const upstream = await fetch(`${API}/api/conversations/${params.id}`, {
      method: 'GET',
      headers: { Authorization: token },
      cache: 'no-store',
    });

    const raw = await upstream.text(); // JSON이 아닐 수도 있음
    // 상태 코드는 그대로 전달
    try {
      return NextResponse.json(JSON.parse(raw), { status: upstream.status });
    } catch {
      return new NextResponse(raw, { status: upstream.status });
    }
  } catch (error) {
    console.error('Error in GET /api/conversations/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}