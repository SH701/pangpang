import { NextRequest } from "next/server"
import { proxyJSON } from "@/app/api/_lib/proxy"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sourceContent = searchParams.get("sourceContent")
  const aiRole = searchParams.get("aiRole")

  // 개발 환경에서는 mock 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    console.log('Honorific variations request (dev):', { sourceContent, aiRole });
    
    // Mock 존댓말 변형 응답
    return Response.json({
      variations: {
        0: "안녕! 실수로 인해 사과드려.",
        1: "안녕하세요! 실수로 인해 사과드립니다.",
        2: "안녕하세요! 실수로 인해 진심으로 사과드립니다.",
        3: "안녕하세요! 실수로 인해 진심으로 사과드립니다.",
        4: "안녕하세요! 실수로 인해 진심으로 사과드립니다."
      }
    });
  }

  return proxyJSON(
    req,
    `/api/language/honorific-variations?sourceContent=${encodeURIComponent(sourceContent ?? "")}${
      aiRole ? `&aiRole=${encodeURIComponent(aiRole)}` : ""
    }`,
    { method: "GET", forwardAuth: true }
  )
}
