/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/conversations/[id]/route.ts
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const mockPersona = {
      id: params.id,
      personaId: params.id,
      name: '김부장님',
      gender: 'MALE',
      age: 45,
      role: 'BOSS',
      aiRole: 'BOSS',
      description: '회사에서 실수했을 때 사과하는 상황',
      profileImageUrl: '/characters/character1.png',
      relationship: 'BOSS',
      createdAt: new Date().toISOString()
    };

    return Response.json(mockPersona);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, `/api/personas/${params.id}`, {
    method: "GET",
    forwardAuth: true,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 개발 환경에서는 성공 응답 반환
  if (process.env.NODE_ENV === 'development') {
    return Response.json({ message: 'Persona deleted successfully' });
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, `/api/personas/${params.id}`, {
    method: "DELETE",
    forwardAuth: true,
  });
}