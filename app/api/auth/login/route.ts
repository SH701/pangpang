import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.json();
      console.log('Login request (dev):', body);
      
      // 테스트 계정 정보
      const testAccounts = [
        { email: 'test@example.com', password: 'password', name: '테스트 사용자' },
        { email: 'dev@example.com', password: 'dev123', name: '개발자' },
        { email: 'user@example.com', password: 'user123', name: '일반 사용자' }
      ];
      
      const account = testAccounts.find(acc => 
        acc.email === body.email && acc.password === body.password
      );
      
      if (account) {
        return NextResponse.json({
          accessToken: `dev-token-${Date.now()}`,
          user: {
            id: 'dev-user-123',
            email: account.email,
            name: account.name,
            koreanLevel: 'INTERMEDIATE',
            profileImageUrl: '/characters/character1.png',
            interests: ['💬 Daily', '🎵 K-Pop', '🔥 Internet Slang']
          }
        }, { status: 200 });
      } else {
        return NextResponse.json({ 
          message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
        }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ 
        message: 'Invalid request body' 
      }, { status: 400 });
    }
  }

  return proxyJSON(req, "/api/auth/login", { method: "POST", forwardAuth: true });
}