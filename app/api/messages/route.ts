import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function GET(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(req.url);
    const conversationId = url.searchParams.get('conversationId');
    console.log('Messages fetch (dev):', conversationId);
    
    // mock 메시지 목록 반환
    return NextResponse.json({
      content: [
        {
          messageId: "dev-msg-1",
          role: "USER",
          content: "안녕하세요, 실수로 인해 사과드립니다.",
          createdAt: new Date(Date.now() - 60000).toISOString()
        },
        {
          messageId: "dev-msg-2", 
          role: "AI",
          content: "안녕하세요. 실수에 대해 자세히 말씀해 주세요. 어떤 상황이었나요?",
          createdAt: new Date(Date.now() - 30000).toISOString()
        }
      ],
      totalElements: 2,
      totalPages: 1,
      currentPage: 1
    }, { status: 200 });
  }

  return proxyJSON(req, "/api/messages", { method: "GET", forwardAuth: true });
}

export async function POST(req:NextRequest){
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.json();
      console.log('Message creation (dev):', body);
      
      // mock 메시지 생성 응답 반환
      return NextResponse.json({
        messageId: "dev-msg-" + Date.now(),
        conversationId: body.conversationId,
        role: body.role,
        content: body.content,
        createdAt: new Date().toISOString()
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ 
        message: 'Invalid request body' 
      }, { status: 400 });
    }
  }

  return proxyJSON(req,"/api/messages",{method:"POST",forwardAuth:true})
}