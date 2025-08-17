// app/api/conversations/[id]/feedback/route.ts
import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    console.log('Feedback fetch (dev):', id);
    
    // mock 피드백 데이터 반환
    return Response.json({
      feedbackId: 1,
      conversationId: parseInt(id),
      politenessScore: 85,
      naturalnessScore: 78,
      pronunciationScore: 82,
      summary: "전반적으로 좋은 대화였습니다. 존댓말 사용이 적절했고, 자연스러운 한국어 표현을 사용했습니다.",
      goodPoints: "존댓말을 적절하게 사용했습니다. 상황에 맞는 표현을 잘 선택했습니다.",
      improvementPoints: "일부 문법적 오류가 있었습니다. 더 자연스러운 한국어 표현을 연습해보세요.",
      improvementExamples: "예시: '~했어요' → '~했습니다', '~해요' → '~합니다'",
      overallEvaluation: "B+",
      transcript: [
        {
          id: 1,
          role: "USER",
          content: "안녕하세요, 선생님. 오늘 수업에 늦어서 죄송합니다.",
          timestamp: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          role: "AI",
          content: "괜찮습니다. 다음에는 시간을 잘 지켜주세요.",
          timestamp: "2024-01-15T10:00:05Z"
        }
      ],
      commonMistakes: [
        {
          id: 1,
          category: "문법",
          description: "존댓말과 반말 혼용",
          suggestion: "일관된 존댓말 사용하기",
          examples: ["안녕하세요 → 안녕하십니까"]
        }
      ],
      improvementSuggestions: [
        "일관된 존댓말 사용 연습",
        "자연스러운 한국어 표현 학습",
        "정확한 발음 연습"
      ]
    });
  }

  return proxyJSON(
    req,
    `/api/conversations/${encodeURIComponent(id)}/feedback`,
    { method: "GET", forwardAuth: true }
  );
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJSON(
    req,
    `/api/conversations/${encodeURIComponent(id)}/feedback`,
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
