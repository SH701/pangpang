import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    
    // 상황별 AI 응답 모킹 데이터
    const aiResponses = {
      'BOSS1': '부장님께 실수에 대해 사과할 때는 정중하고 진심 어린 태도가 중요합니다. "죄송합니다. 제가 실수했습니다. 앞으로는 더욱 신중하게 하겠습니다."라고 말씀하시면 됩니다.',
      'BOSS2': '연차나 반차를 요청할 때는 미리 말씀드리고, 업무에 지장이 없도록 준비하는 것이 좋습니다. "부장님, 다음 주 월요일에 반차를 사용하고 싶은데 괜찮으실까요?"',
      'BOSS3': '업무 피드백을 요청할 때는 구체적인 부분을 언급하는 것이 좋습니다. "부장님, 제가 작성한 보고서에 대해 피드백을 주실 수 있을까요?"',
      'GF_PARENTS1': '처음 만날 때는 정중하고 예의 바른 인사가 중요합니다. "안녕하세요. 저는 [이름]입니다. 만나뵙게 되어서 영광입니다."',
      'CLERK1': '예약을 변경할 때는 정중하게 요청하고, 가능한 대안을 제시하는 것이 좋습니다. "죄송하지만 예약을 변경하고 싶은데 가능할까요?"'
    };
    
    const mockAiReply = {
      id: Date.now(),
      conversationId: body.conversationId,
      content: aiResponses[body.situation as keyof typeof aiResponses] || '안녕하세요! 어떤 도움이 필요하신가요?',
      role: 'AI',
      createdAt: new Date().toISOString(),
      aiPersona: {
        name: 'AI 어시스턴트',
        profileImageUrl: '/characters/character1.png'
      }
    };

    return Response.json(mockAiReply);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, "/api/messages/ai-reply", {
    method: "POST",
    forwardAuth: true,
  });
}