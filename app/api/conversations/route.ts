/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 1) 공통 CORS 헤더
  const resHeaders = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })

  // 2) 인증 토큰 꺼내기
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401, headers: resHeaders }
    )
  }
  const token = auth.split(' ')[1]

  // 3) 백엔드에 대화 생성 요청 프록시
  let upstreamRes: Response
  try {
    upstreamRes = await fetch(
      `${process.env.API_URL}/api/conversations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // 요청 바디 그대로 전달
        body: await req.text(),
      }
    )
  } catch (e) {
    console.error('Upstream fetch error', e)
    return NextResponse.json(
      { message: 'Upstream fetch failed' },
      { status: 502, headers: resHeaders }
    )
  }

  // 4) 백엔드 응답 그대로 내려주기
  const data = await upstreamRes.json()
  return NextResponse.json(
    data,
    {
      status: upstreamRes.status,
      headers: resHeaders
    }
  )
}
export async function GET(req: NextRequest) {
  // 1) CORS/응답 헤더 (필요시)
  const resHeaders = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })

  // 2) 인증 토큰
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401, headers: resHeaders }
    )
  }
  const token = auth.split(' ')[1];
  const url = new URL(req.url)
  const query = url.search // ex) ?status=ACTIVE&page=1...

  let upstreamRes: Response
  try {
    upstreamRes = await fetch(
      `${process.env.API_URL}/api/conversations` + query,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )
  } catch (e) {
    return NextResponse.json(
      { message: 'Upstream fetch failed' },
      { status: 502, headers: resHeaders }
    )
  }

  // 4) 백엔드 응답 그대로 반환
  const data = await upstreamRes.json()
  return NextResponse.json(
    data,
    {
      status: upstreamRes.status,
      headers: resHeaders,
    }
  )
}

