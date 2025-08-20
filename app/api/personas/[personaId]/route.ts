import { NextRequest } from "next/server";
import { proxyJSON } from "@/app/api/_lib/proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: { personaId: string } }
) {
  const { personaId } = params;

  return proxyJSON(req, `/api/personas/${personaId}`, {
    method: "GET",
    forwardAuth: true,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { personaId: string } }
) {
  const { personaId } = params;

  return proxyJSON(req, `/api/personas/${personaId}`, {
    method: "DELETE",
    forwardAuth: true,
  });
}
