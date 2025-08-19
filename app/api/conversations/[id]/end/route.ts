// app/api/conversations/[id]/end/route.ts
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const mockEndResponse = {
      conversationId: params.id,
      status: 'ENDED',
      endedAt: new Date().toISOString(),
      message: '대화가 성공적으로 종료되었습니다.'
    };

    return Response.json(mockEndResponse);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, `/api/conversations/${params.id}/end`, {
    method: "PUT",
    forwardAuth: true,
  });
}
