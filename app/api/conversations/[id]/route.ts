// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_URL ?? 'http://localhost:8080';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ await 필요

  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    console.log('Conversation detail fetch (dev):', id);
    
    // mock 대화 상세 정보 반환
    return NextResponse.json({
      conversationId: id,
      status: "ACTIVE",
      aiPersona: {
        personaId: "dev-persona-123",
        name: "Jisoo",
        gender: "FEMALE",
        age: 25,
        relationship: "BOSS",
        description: "Apologizing for a mistake at work.",
        profileImageUrl: "/characters/character1.png"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 200 });
  }

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
