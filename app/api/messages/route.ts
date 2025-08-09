import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Authorization 헤더 체크
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is missing' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Spring Boot API로 프록시
    const backendRes = await fetch(`${process.env.API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token, // 그대로 전달
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error in /api/messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is missing' },
        { status: 401 }
      );
    }

    // URL 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const page = searchParams.get('page') || '1';
    const size = searchParams.get('size') || '10';

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${process.env.API_URL}/api/messages?conversationId=${conversationId}&page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: { Authorization: token },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}