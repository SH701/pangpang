// app/api/conversations/[id]/route.ts
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const mockConversation = {
      id: params.id,
      conversationId: params.id,
      status: 'ENDED', // 결과 페이지는 종료된 대화
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      aiPersona: {
        id: 'persona-1',
        name: '김부장님',
        description: '회사에서 실수했을 때 사과하는 상황',
        profileImageUrl: '/characters/character1.png',
        gender: 'MALE',
        age: 45,
        role: 'BOSS',
        aiRole: 'BOSS'
      },
      situation: 'BOSS1',
      messages: [
        {
          id: 1,
          content: '안녕하세요! 오늘은 어떤 도움이 필요하신가요?',
          role: 'AI',
          createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          content: '실수했을 때 어떻게 사과해야 할지 궁금해요.',
          role: 'USER',
          createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          content: '부장님께 실수에 대해 사과할 때는 정중하고 진심 어린 태도가 중요합니다.',
          role: 'AI',
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          content: '죄송합니다. 제가 실수했습니다. 앞으로는 더욱 신중하게 하겠습니다.',
          role: 'USER',
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          content: '아주 좋은 사과 표현입니다! 정중하고 진심 어린 태도로 말씀하셨네요.',
          role: 'AI',
          createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        }
      ]
    };

    return Response.json(mockConversation);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, `/api/conversations/${params.id}`, {
    method: "GET",
    forwardAuth: true,
  });
}
