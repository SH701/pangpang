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
        userId: 1,
        aiPersona: {
          id: 1,
          personaId: "dev-persona-1",
          userId: 1,
          name: "친근한 친구",
          gender: "FEMALE",
          age: 25,
          relationship: "FRIEND",
          description: "일상적인 대화를 나누는 친구",
          profileImageUrl: "/avatars/avatar1.png"
        },
        status: "ENDED",
        situation: "일상 대화",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        feedback: {
          feedbackId: 1,
          conversationId: "dev-conversation-1",
          politenessScore: 85,
          naturalnessScore: 90,
          overallEvaluation: "친근하고 자연스러운 대화였습니다."
        }
      },
      {
        conversationId: "dev-conversation-2",
        userId: 1,
        aiPersona: {
          id: 2,
          personaId: "dev-persona-2",
          userId: 1,
          name: "비즈니스 파트너",
          gender: "MALE",
          age: 35,
          relationship: "COLLEAGUE",
          description: "업무 협의를 위한 전문적인 대화",
          profileImageUrl: "/avatars/avatar2.png"
        },
        status: "ACTIVE",
        situation: "업무 협의",
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2시간 전
        feedback: null
      },
      {
        conversationId: "dev-conversation-3",
        userId: 1,
        aiPersona: {
          id: 3,
          personaId: "dev-persona-3",
          userId: 1,
          name: "가족",
          gender: "FEMALE",
          age: 50,
          relationship: "FAMILY",
          description: "가족과의 따뜻한 대화",
          profileImageUrl: "/avatars/avatar3.png"
        },
        status: "ENDED",
        situation: "가족 대화",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        feedback: {
          feedbackId: 3,
          conversationId: "dev-conversation-3",
          politenessScore: 78,
          naturalnessScore: 95,
          overallEvaluation: "가족다운 따뜻한 대화였습니다."
        }
      },
      {
        conversationId: "dev-conversation-4",
        userId: 1,
        aiPersona: {
          id: 4,
          personaId: "dev-persona-4",
          userId: 1,
          name: "스터디 파트너",
          gender: "MALE",
          age: 28,
          relationship: "STUDY_PARTNER",
          description: "학습과 성장을 위한 대화",
          profileImageUrl: "/avatars/avatar4.png"
        },
        status: "ACTIVE",
        situation: "학습 토론",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
        feedback: null
      },
      {
        conversationId: "dev-conversation-5",
        userId: 1,
        aiPersona: {
          id: 5,
          personaId: "dev-persona-5",
          userId: 1,
          name: "취미 친구",
          gender: "FEMALE",
          age: 30,
          relationship: "HOBBY_FRIEND",
          description: "취미와 관심사를 공유하는 대화",
          profileImageUrl: "/avatars/avatar5.png"
        },
        status: "ENDED",
        situation: "취미 공유",
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3일 전
        feedback: {
          feedbackId: 5,
          conversationId: "dev-conversation-5",
          politenessScore: 88,
          naturalnessScore: 92,
          overallEvaluation: "취미에 대한 열정이 느껴지는 대화였습니다."
        }
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

