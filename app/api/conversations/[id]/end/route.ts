// app/api/conversations/[id]/end/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:8080';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
  }

  // 개발 환경에서는 mock 응답
  if (process.env.NODE_ENV === 'development') {
    console.log(`Mock: 대화 ${id} 종료 성공`)
    return NextResponse.json({
      success: true,
      message: '대화가 성공적으로 종료되었습니다',
      conversationId: parseInt(id),
      endedAt: new Date().toISOString()
    }, { status: 200 })
  }

  try {
    const upstream = await fetch(`${API}/api/conversations/${id}/end`, {
      method: 'PUT',
      headers: { authorization: token },
      cache: 'no-store',
    });

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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
