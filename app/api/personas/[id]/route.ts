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
    console.error('Error in GET /api/personas/[id]:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ GET과 동일하게 await
  const token = req.headers.get('authorization');
  if (!token) {
    return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${API}/api/personas/${id}`, {
      method: 'DELETE',
      headers: { authorization: token },
      cache: 'no-store',
    });

     if (upstream.ok || upstream.status === 404) {
      return new NextResponse(null, { status: 204 });
    }

    const text = await upstream.text();
    return new NextResponse(text || 'Upstream error', { status: upstream.status });
  } catch (e) {
    // 여기 오면 대부분 params / API_URL / fetch 예외
    console.error('Error in DELETE /api/personas/[id]:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}