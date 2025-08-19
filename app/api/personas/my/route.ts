// app/api/personas/my/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const mockPersonas = [
      {
        id: 1,
        personaId: 1,
        name: '김부장님',
        profileImageUrl: '/characters/character1.png',
        description: '회사에서 실수했을 때 사과하는 상황',
        situation: 'BOSS1'
      },
      {
        id: 2,
        personaId: 2,
        name: '여자친구 부모님',
        profileImageUrl: '/characters/character2.png',
        description: '처음 만날 때 인사하는 상황',
        situation: 'GF_PARENTS1'
      },
      {
        id: 3,
        personaId: 3,
        name: '호텔 직원',
        profileImageUrl: '/characters/character3.png',
        description: '예약을 변경하고 싶을 때',
        situation: 'CLERK1'
      },
      {
        id: 4,
        personaId: 4,
        name: '상사',
        profileImageUrl: '/characters/character4.png',
        description: '업무 피드백을 요청할 때',
        situation: 'BOSS3'
      },
      {
        id: 5,
        personaId: 5,
        name: '식당 직원',
        profileImageUrl: '/characters/character1.png',
        description: '불만사항을 제기할 때',
        situation: 'CLERK3'
      }
    ];

    return Response.json(mockPersonas);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, "/api/personas/my", {
    method: "GET",
    forwardAuth: true,
  });
}
