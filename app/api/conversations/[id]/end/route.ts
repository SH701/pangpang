// app/api/conversations/[id]/end/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:8080';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next 15 호환
) {
  const { id } = await params;
  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${API}/api/conversations/${id}/end`, {
      method: 'PUT',
      headers: { authorization: token },
      cache: 'no-store',
    });

    // 보통 200 OK (바디가 없거나 짧은 문자열)
    const text = await upstream.text().catch(() => '');
    return new NextResponse(text || null, {
      status: upstream.status,
      headers: {
        'content-type':
          upstream.headers.get('content-type') ?? (text ? 'text/plain' : ""),
      },
    });
  } catch (e) {
    console.error('Error in PUT /api/conversations/[id]/end:', e);
    // 여기선 500 숨기고 200으로 처리하고 싶으면 아래 줄을:
    // return new NextResponse(null, { status: 200 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
