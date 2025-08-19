/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    
    // 모킹 대화방 데이터 생성
    const mockConversation = {
      conversationId: `conv-${Date.now()}`,
      id: `conv-${Date.now()}`,
      personaId: body.personaId || 'persona-1',
      situation: body.situation || 'BOSS1',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      aiPersona: {
        id: body.personaId || 'persona-1',
        name: '새로운 AI',
        description: body.situation || '새로운 상황',
        profileImageUrl: '/characters/character1.png'
      }
    };

    return Response.json(mockConversation);
  }

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
  // 개발 환경에서는 모킹 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    
    // 모킹 데이터 생성
    const mockConversations = [
      {
        conversationId: 'conv-1',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        aiPersona: {
          id: 1,
          name: '김부장님',
          description: '회사에서 실수했을 때 사과하는 상황',
          profileImageUrl: '/characters/character1.png'
        },
        situation: 'BOSS1'
      },
      {
        conversationId: 'conv-2',
        status: 'ENDED',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        aiPersona: {
          id: 2,
          name: '여자친구 부모님',
          description: '처음 만날 때 인사하는 상황',
          profileImageUrl: '/characters/character2.png'
        },
        situation: 'GF_PARENTS1'
      },
      {
        conversationId: 'conv-3',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
        aiPersona: {
          id: 3,
          name: '호텔 직원',
          description: '예약을 변경하고 싶을 때',
          profileImageUrl: '/characters/character3.png'
        },
        situation: 'CLERK1'
      },
      {
        conversationId: 'conv-4',
        status: 'ENDED',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
        aiPersona: {
          id: 4,
          name: '상사',
          description: '업무 피드백을 요청할 때',
          profileImageUrl: '/characters/character4.png'
        },
        situation: 'BOSS3'
      },
      {
        conversationId: 'conv-5',
        status: 'ENDED',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
        aiPersona: {
          id: 5,
          name: '식당 직원',
          description: '불만사항을 제기할 때',
          profileImageUrl: '/characters/character1.png'
        },
        situation: 'CLERK3'
      }
    ];

    // 상태별 필터링
    let filteredConversations = mockConversations;
    if (status === 'ACTIVE') {
      filteredConversations = mockConversations.filter(conv => conv.status === 'ACTIVE');
    } else if (status === 'ENDED') {
      filteredConversations = mockConversations.filter(conv => conv.status === 'ENDED');
    }

    return NextResponse.json({
      content: filteredConversations,
      totalElements: filteredConversations.length,
      totalPages: 1,
      currentPage: 1,
      size: 1000
    });
  }

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

