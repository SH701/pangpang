import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.json();
      console.log('Signup request (dev):', body);
      
      // 필수 필드 검증
      if (!body.email || !body.password || !body.nickname) {
        return NextResponse.json({ 
          message: '이메일, 비밀번호, 닉네임을 모두 입력해주세요.' 
        }, { status: 400 });
      }
      
      // 성공 응답
      return NextResponse.json({
        accessToken: `dev-signup-token-${Date.now()}`,
        user: {
          id: 'dev-new-user-' + Date.now(),
          email: body.email,
          nickname: body.nickname,
          koreanLevel: 'BEGINNER',
          profileImageUrl: '/characters/character1.png',
          interests: []
        },
        message: '회원가입이 완료되었습니다.'
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ 
        message: 'Invalid request body' 
      }, { status: 400 });
    }
  }

  return proxyJSON(req, "/api/auth/signup", { method: "POST", forwardAuth: true });
}