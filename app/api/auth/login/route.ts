import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 개발 환경에서 임시 응답
    if (process.env.NODE_ENV === 'development') {
      console.log('로그인 요청:', body);
      
      // 간단한 유효성 검사
      if (!body.email || !body.password) {
        return NextResponse.json(
          { message: '이메일과 비밀번호를 입력해주세요.' },
          { status: 400 }
        );
      }
      
      // 테스트용 계정 (실제로는 데이터베이스에서 확인)
      if (body.email === 'test@example.com' && body.password === 'password') {
        return NextResponse.json({
          message: '로그인이 완료되었습니다.',
          accessToken: 'dev-login-token-' + Date.now(),
          user: {
            id: 1,
            email: body.email,
            nickname: '테스트 사용자'
          }
        });
      }
      
      // 로그인 실패
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }
    
    // 프로덕션에서는 프록시 사용
    const { proxyJSON } = await import("@/app/api/_lib/proxy");
    return proxyJSON(req, "/api/auth/login", { method: "POST", forwardAuth: true });
    
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}