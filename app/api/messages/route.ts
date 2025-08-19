import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(req.url);
    const conversationId = url.searchParams.get('conversationId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '1000');
    
    const mockMessages = [
      {
        messageId: 1,
        type: 'AI',
        content: '안녕하세요! 오늘은 어떤 도움이 필요하신가요?',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        aiPersona: {
          name: '김부장님',
          profileImageUrl: '/characters/character1.png'
        }
      },
      {
        messageId: 2,
        type: 'USER',
        content: '실수했을 때 어떻게 사과해야 할지 궁금해요.',
        createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
      },
      {
        messageId: 3,
        type: 'AI',
        content: '부장님께 실수에 대해 사과할 때는 정중하고 진심 어린 태도가 중요합니다. "죄송합니다. 제가 실수했습니다. 앞으로는 더욱 신중하게 하겠습니다."라고 말씀하시면 됩니다.',
        createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        aiPersona: {
          name: '김부장님',
          profileImageUrl: '/characters/character1.png'
        }
      },
      {
        messageId: 4,
        type: 'USER',
        content: '죄송합니다. 제가 실수했습니다. 앞으로는 더욱 신중하게 하겠습니다.',
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      },
      {
        messageId: 5,
        type: 'AI',
        content: '아주 좋은 사과 표현입니다! 정중하고 진심 어린 태도로 말씀하셨네요. 이렇게 사과하면 부장님께서도 이해해주실 것입니다.',
        createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        aiPersona: {
          name: '김부장님',
          profileImageUrl: '/characters/character1.png'
        }
      }
    ];

    // 페이지네이션 처리
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedMessages = mockMessages.slice(startIndex, endIndex);

    return Response.json({
      content: paginatedMessages,
      totalElements: mockMessages.length,
      totalPages: Math.ceil(mockMessages.length / size),
      currentPage: page,
      size: size
    });
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, "/api/messages", {
    method: "GET",
    forwardAuth: true,
  });
}

export async function POST(req: NextRequest) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    
    const mockMessage = {
      messageId: Date.now(),
      conversationId: body.conversationId,
      content: body.content,
      type: body.role || 'USER',
      createdAt: new Date().toISOString()
    };

    return Response.json(mockMessage);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, "/api/messages", {
    method: "POST",
    forwardAuth: true,
  });
}