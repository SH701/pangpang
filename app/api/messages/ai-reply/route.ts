import { NextRequest, NextResponse } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function POST(req: NextRequest) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.json();
      console.log('AI reply request (dev):', body);
      
      // mock AI 응답 반환
      const aiReplies = [
        "네, 이해했습니다. 그런 상황이라면 정말 어려우셨겠네요.",
        "사과의 마음을 전달하는 것은 중요합니다. 구체적으로 어떤 실수였는지 말씀해 주세요.",
        "직장에서의 실수는 누구나 할 수 있는 일입니다. 차근차근 해결해보시죠.",
        "상사의 입장에서도 실수를 인정하고 사과하는 태도를 높이 평가할 것입니다.",
        "앞으로는 이런 실수가 반복되지 않도록 주의하시면 됩니다."
      ];
      
      const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
      
      return NextResponse.json({
        userMessage: {
          messageId: "dev-user-msg-" + Date.now(),
          role: "USER",
          content: body.content,
          createdAt: new Date().toISOString()
        },
        aiMessage: {
          messageId: "dev-ai-msg-" + Date.now(),
          role: "AI",
          content: randomReply,
          createdAt: new Date().toISOString()
        }
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ 
        message: 'Invalid request body' 
      }, { status: 400 });
    }
  }

  return proxyJSON(req, "/api/messages/ai-reply", { method: "POST", forwardAuth: true });
}