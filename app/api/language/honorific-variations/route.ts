import { NextRequest } from "next/server"
import { proxyJSON } from "@/app/api/_lib/proxy"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sourceContent = searchParams.get("sourceContent")
  const aiRole = searchParams.get("aiRole")

  return proxyJSON(
    req,
    `/api/language/honorific-variations?sourceContent=${encodeURIComponent(sourceContent ?? "")}${
      aiRole ? `&aiRole=${encodeURIComponent(aiRole)}` : ""
    }`,
    { method: "GET", forwardAuth: true }
  )
}
