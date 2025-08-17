// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:8080';

export async function GET(
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
    console.log(`Mock: 대화 ${id} 정보 조회 성공`)
    return NextResponse.json({
      conversationId: parseInt(id),
      userId: 1,
      aiPersona: {
        id: 'dev-persona-1',
        name: '친근한 친구',
        description: '일상적인 대화를 나눌 수 있는 친구',
        profileImageUrl: '/circle/circle1.png',
        gender: 'NONE',
        age: 25,
        relationship: 'FRIEND'
      },
      status: 'ACTIVE',
      situation: '일상 대화',
      chatNodeId: 'dev-node-1',
      createdAt: new Date().toISOString(),
      endedAt: null
    }, { status: 200 })
  }

  try {
    const upstream = await fetch(`${API}/api/conversations/${id}`, {
      headers: { authorization: token },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => '');
      console.error('대화 정보 조회 실패:', upstream.status, errorText);
      return NextResponse.json({ error: `대화 정보를 불러올 수 없습니다: ${upstream.status}` }, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Error in GET /api/conversations/[id]:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
