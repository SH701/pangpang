// app/api/personas/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    
    // 모킹 페르소나 데이터 생성
    const mockPersona = {
      personaId: `persona-${Date.now()}`,
      id: `persona-${Date.now()}`,
      name: body.name || '새로운 AI',
      gender: body.gender || 'NONE',
      age: body.age || 20,
      relationship: body.relationship || 'BOSS',
      description: body.description || '새로운 상황',
      profileImageUrl: body.profileImageUrl || '/characters/character1.png',
      createdAt: new Date().toISOString()
    };

    return Response.json(mockPersona);
  }

  // 백엔드 연결 시 프록시 사용
  const { proxyJSON } = await import("@/app/api/_lib/proxy");
  return proxyJSON(req, "/api/personas", {
    method: "POST",
    forwardAuth: true,
  });
}
