// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:8080';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Promise로 받기
) {
  const { id } = await params; // ✅ await 필요

  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${API}/api/conversations/${id}`, {
      headers: { authorization: token },
      cache: 'no-store',
    });

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (e) {
    console.error('Error in GET /api/conversations/[id]:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
