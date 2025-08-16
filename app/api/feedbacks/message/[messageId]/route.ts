import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

type FeedbackMessageParams = {
  messageId: string;
};

export async function POST(
  req: NextRequest,
  context: unknown // 직접 타입 지정하지 않음
) {
  // 런타임에서 안전하게 타입 좁히기
  const { messageId } = (context as { params: FeedbackMessageParams }).params;

  // 개발 환경에서는 mock 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    console.log('Feedback request (dev):', { messageId });
    
    // Mock 피드백 응답
    return Response.json({
      success: true,
      content: "이 메시지는 존댓말로 잘 작성되었습니다. 하지만 더 정중하게 표현할 수 있는 부분이 있습니다.",
      messageId: messageId
    });
  }

  return proxyJSON(
    req,
    `/api/feedbacks/message/${messageId}`,
    { method: "POST", forwardAuth: true }
  );
}
