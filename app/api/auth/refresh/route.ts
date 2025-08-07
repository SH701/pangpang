
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json(
      { message: 'refreshToken is required' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(
      { accessToken: data.accessToken },
      { status: 200 }
    );
  } catch (err) {
    console.error('Refresh token proxy error', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
