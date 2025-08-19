// app/api/conversations/[id]/feedback/route.ts
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const mockFeedback = {
      conversationId: params.id,
      feedback: {
        overallScore: 85,
        politenessScore: 90,
        grammarScore: 80,
        fluencyScore: 85,
        suggestions: [
          "존댓말 사용이 적절했습니다.",
          "문법적으로 정확한 표현을 사용했습니다.",
          "상황에 맞는 적절한 어휘를 선택했습니다.",
          "정중하고 진심 어린 태도로 대화했습니다."
        ],
        commonMistakes: [
          "일부 문장에서 조사 사용을 더 정확하게 할 수 있습니다.",
          "더 자연스러운 한국어 표현을 연습해보세요.",
          "비즈니스 상황에서 사용할 수 있는 더 다양한 표현을 학습해보세요."
        ],
        transcript: [
          {
            role: 'USER',
            content: '실수했을 때 어떻게 사과해야 할지 궁금해요.',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
          },
          {
            role: 'AI',
            content: '부장님께 실수에 대해 사과할 때는 정중하고 진심 어린 태도가 중요합니다.',
            timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString()
          },
          {
            role: 'USER',
            content: '죄송합니다. 제가 실수했습니다. 앞으로는 더욱 신중하게 하겠습니다.',
            timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
          }
        ],
        conversationSummary: "부장님께 실수에 대해 사과하는 상황에서 정중하고 진심 어린 태도로 대화를 진행했습니다.",
        whatYouDidWell: [
          "존댓말을 적절하게 사용했습니다.",
          "정중한 사과 표현을 사용했습니다.",
          "앞으로의 개선 의지를 표현했습니다."
        ],
        whatYouCanImprove: [
          "더 다양한 사과 표현을 학습해보세요.",
          "비즈니스 상황에 맞는 추가적인 표현을 연습해보세요."
        ]
      }
    };

    return Response.json(mockFeedback);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, `/api/conversations/${params.id}/feedback`, {
    method: "GET",
    forwardAuth: true,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    
    const mockPostResponse = {
      conversationId: params.id,
      feedbackId: `feedback-${Date.now()}`,
      message: '피드백이 성공적으로 저장되었습니다.',
      data: body
    };

    return Response.json(mockPostResponse);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(
    req,
    `/api/conversations/${encodeURIComponent(params.id)}/feedback`,
    { method: "POST", forwardAuth: true }
  );
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
