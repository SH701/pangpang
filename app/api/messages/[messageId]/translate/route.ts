// app/api/messages/[messageId]/translate/route.ts
import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8080";

// ✅ PUT /api/messages/[messageId]/translate
export async function PUT(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;

  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token is missing" },
      { status: 401 }
    );
  }

  try {
    const upstream = await fetch(`${API}/api/messages/${messageId}/translate`, {
      method: "PUT",
      headers: {
        authorization: token,
        "content-type": req.headers.get("content-type") ?? "application/json",
      },
      body: await req.text(), // proxyJson과 동일: body 그대로 전달
      cache: "no-store",
    });

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e) {
    console.error(`Error in PUT /api/messages/${messageId}/translate:`, e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
