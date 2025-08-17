/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    try {
      const body = await req.json();
      console.log('Conversation creation (dev):', body);
      
      // mock 대화방 생성 응답 반환
      return NextResponse.json({
        conversationId: "dev-conversation-" + Date.now(),
        personaId: body.personaId,
        situation: body.situation,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ 
        message: 'Invalid request body' 
      }, { status: 400 });
    }
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
  // 개발 환경에서는 mock 응답 제공
  if (process.env.NODE_ENV === 'development') {
    console.log('Conversations fetch (dev)');
    
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || 'ALL';
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '20');
    
    // Mock 대화 목록 데이터
    const mockConversations = [
      {
        conversationId: "dev-conversation-1",
        personaId: "dev-persona-1",
        personaName: "친근한 친구",
        situation: "일상 대화",
        status: "ENDED",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        endedAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
        lastMessage: "안녕하세요! 오늘 날씨가 정말 좋네요.",
        politenessScore: 85,
        naturalnessScore: 90
      },
      {
        conversationId: "dev-conversation-2",
        personaId: "dev-persona-2", 
        personaName: "비즈니스 파트너",
        situation: "업무 협의",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2시간 전
        endedAt: null,
        lastMessage: "프로젝트 진행 상황에 대해 논의해보겠습니다.",
        politenessScore: 92,
        naturalnessScore: 88
      },
      {
        conversationId: "dev-conversation-3",
        personaId: "dev-persona-3",
        personaName: "가족",
        situation: "가족 대화",
        status: "ENDED",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        endedAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        lastMessage: "오늘 저녁 메뉴는 뭘로 할까요?",
        politenessScore: 78,
        naturalnessScore: 95
      }
    ];
    
    // 상태별 필터링
    let filteredConversations = mockConversations;
    if (status !== 'ALL') {
      filteredConversations = mockConversations.filter(conv => conv.status === status);
    }
    
    // 페이지네이션
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedConversations = filteredConversations.slice(startIndex, endIndex);
    
    return NextResponse.json({
      content: paginatedConversations,
      totalElements: filteredConversations.length,
      totalPages: Math.ceil(filteredConversations.length / size),
      currentPage: page,
      size: size
    }, { status: 200 });
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

