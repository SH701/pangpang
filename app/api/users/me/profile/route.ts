/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.API_URL; // ex) http://3.35.132.182:8080

export async function PUT(req: NextRequest) {
  // 1) ENV 검사
  if (!BASE_URL) {
    return NextResponse.json({ message: 'API_URL not set' }, { status: 500 });
  }

  // 2) JSON 파싱
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  // 프론트에서 온 값 중 존재하는 것만 전송 (백엔드가 일부 필드만 허용할 수 있음)
  const { nickname, birthDate, koreanLevel, profileImageUrl, interests } = body;
  const payload: Record<string, any> = {};
  if (nickname !== undefined) payload.nickname = nickname;
  if (birthDate !== undefined) payload.birthDate = birthDate;
  if (koreanLevel !== undefined) payload.koreanLevel = koreanLevel;
  if (profileImageUrl !== undefined) payload.profileImageUrl = profileImageUrl;
  if (interests !== undefined) payload.interests = interests;

  try {
    // 3) 인증 전달: Authorization 헤더 정규화 (중복 Bearer 방지)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    const incomingAuth = req.headers.get('authorization') || '';
    // incomingAuth가 "Bearer xxx" 이든 "xxx" 이든 항상 "Bearer xxx" 로 맞춤
    let token = incomingAuth.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      // 혹시 쿠키에 저장했다면 여기서 꺼내서 사용
      token = req.cookies.get('accessToken')?.value || '';
    }
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // (세션 기반 + CSRF 켠 Spring이면 필요)
    const xsrf = req.cookies.get('XSRF-TOKEN')?.value;
    if (xsrf) headers['X-CSRF-TOKEN'] = xsrf;

    // 4) 업스트림 호출 (URL 안전 조합)
    const url = new URL('/api/users/me/profile', BASE_URL).toString();
    const upstream = await fetch(url, {
      method: 'PUT', // 백엔드가 PATCH만 받으면 'PATCH'로 바꿔보기
      headers,
      body: JSON.stringify(payload),
    });

    // 5) 실패 시 원문 메시지 그대로 내려서 원인 파악
    const text = await upstream.text();
    if (!upstream.ok) {
      let message = text;
      try {
        message = JSON.parse(text).message || text;
      } catch {}
      // 디버그용: 상태/메시지 노출(문제 해결 후 제거 권장)
      return NextResponse.json(
        { message, upstreamStatus: upstream.status },
        { status: upstream.status }
      );
    }

    // 6) 성공
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: true };
    }
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('Profile proxy error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
