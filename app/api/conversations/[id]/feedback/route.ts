// app/api/conversations/[id]/feedback/route.ts
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
    console.log(`Mock: 대화 ${id} 피드백 조회 성공`)
    return NextResponse.json({
      conversationId: parseInt(id),
      overallEvaluation: '상황에 적절하게 대응했지만, 더 정중한 어조를 사용할 수 있습니다.',
      politenessScore: 75,
      naturalnessScore: 85,
      transcript: [
        {
          id: 1,
          role: 'USER',
          content: '안녕하세요, 실수로 인해 사과드립니다.',
          timestamp: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: 2,
          role: 'AI',
          content: '안녕하세요! 실수를 인정하고 사과하는 것은 매우 중요한 자세입니다. 어떤 일이 있었나요?',
          timestamp: new Date(Date.now() - 30000).toISOString()
        }
      ],
      commonMistakes: [
        {
          id: 1,
          category: '존댓말 사용',
          description: '상황에 맞는 적절한 존댓말을 사용하면 더 좋습니다.',
          suggestion: '더 정중한 표현을 사용해보세요.',
          examples: ['사과드립니다 → 사과드리겠습니다', '죄송합니다 → 죄송하겠습니다']
        },
        {
          id: 2,
          category: '문장 구조',
          description: '문장을 더 자연스럽게 구성할 수 있습니다.',
          suggestion: '자연스러운 한국어 표현을 연습해보세요.',
          examples: ['실수로 인해 → 실수 때문에', '사과드립니다 → 사과드리겠습니다']
        }
      ],
      improvementSuggestions: [
        '상황에 맞는 적절한 존댓말 사용하기',
        '자연스러운 한국어 문장 구성하기',
        '감정을 담아 진정성 있게 표현하기'
      ]
    }, { status: 200 })
  }

  try {
    const upstream = await fetch(`${API}/api/conversations/${id}/feedback`, {
      headers: { authorization: token },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => '');
      console.error('피드백 조회 실패:', upstream.status, errorText);
      return NextResponse.json({ error: `피드백을 불러올 수 없습니다: ${upstream.status}` }, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Error in GET /api/conversations/[id]/feedback:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return NextResponse.json({ message: `POST request for conversation ${id} is not implemented` }, { status: 501 });
}

// (필요하면) CORS 프리플라이트
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}
