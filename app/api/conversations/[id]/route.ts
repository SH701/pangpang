// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8080";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token is missing" },
      { status: 401 }
    );
  }

  try {
    const upstream = await fetch(`${API}/api/conversations/${id}`, {
      headers: { authorization: token },
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
    console.error("Error in GET /api/conversations/[id]:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE 추가
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json(
      { error: "Authorization token is missing" },
      { status: 401 }
    );
  }

  try {
    const upstream = await fetch(`${API}/api/conversations/${id}`, {
      method: "DELETE",
      headers: { authorization: token },
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
    console.error("Error in DELETE /api/conversations/[id]:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
