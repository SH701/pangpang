/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proxyJSON } from '@/app/api/_lib/proxy';

const API = process.env.API_URL ?? 'http://localhost:8080';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ await 필요

  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${API}/api/personas/${id}`, {
      headers: { authorization: token },
      cache: 'no-store',
    });

    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (e) {
    console.error('Error in GET /api/conversations/[id]:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!params?.id) {
    return new Response(JSON.stringify({ message: 'conversation id is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  return proxyJSON(req as any, `/api/conversations/${params.id}`, {
    method: 'DELETE',
    forwardAuth: true,
    retries: 0,
    devPassthrough: true,
  });
}