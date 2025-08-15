import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 개발 환경에서 임시 응답
    if (process.env.NODE_ENV === 'development') {
      console.log('회원가입 요청:', body);
      
      // 간단한 유효성 검사
      if (!body.email || !body.password || !body.nickname) {
        return NextResponse.json(
          { message: '필수 정보가 누락되었습니다.' },
          { status: 400 }
        );
      }
      
      // 성공 응답 (실제로는 백엔드에서 처리)
      return NextResponse.json({
        message: '회원가입이 완료되었습니다.',
        accessToken: 'dev-token-' + Date.now(),
        user: {
          id: 1,
          email: body.email,
          nickname: body.nickname
        }
      });
    }
    
    // 프로덕션에서는 프록시 사용
    const { proxyJSON } = await import("@/app/api/_lib/proxy");
    return proxyJSON(req, "/api/auth/signup", { method: "POST", forwardAuth: true });
    
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}