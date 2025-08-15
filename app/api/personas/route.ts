// app/api/personas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.json();
      console.log('Persona creation (dev):', body);
      
      // mock 페르소나 생성 응답 반환
      return NextResponse.json({
        personaId: "dev-persona-" + Date.now(),
        name: body.name,
        gender: body.gender,
        age: body.age,
        relationship: body.relationship,
        description: body.description,
        profileImageUrl: body.profileImageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ 
        message: 'Invalid request body' 
      }, { status: 400 });
    }
  }

  return proxyJSON(req, "/api/personas", {
    method: "POST",
    forwardAuth: true,
  });
}
