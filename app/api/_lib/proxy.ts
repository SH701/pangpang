/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // Edge 런타임이면 env/소켓 제약 있음

const BASE = process.env.API_URL; 

function assertBase() {
  if (!BASE || !/^https?:\/\//.test(BASE)) {
    return NextResponse.json(
      { message: "API_URL is missing or invalid (e.g. http://host:port)" },
      { status: 500 }
    );
  }
  return null;
}

export async function proxyJSON(
  req: NextRequest,
  upstreamPath: string,             // 예: "/api/auth/signup"
  init?: RequestInit & {
    // GET이면 body 넣지 말기
    method?: "GET"|"POST"|"PUT"|"PATCH"|"DELETE";
    forwardAuth?: boolean;          // Authorization 헤더 pass-through
    timeoutMs?: number;             // 기본 12s
    bodyJSON?: any;                 // JSON 바디(문자열화 처리)
  }
) {
  // 0) ENV 검증
  const envError = assertBase();
  if (envError) return envError;

  const method = init?.method ?? "GET";
  const forwardAuth = init?.forwardAuth ?? false;
  
  const timeoutMs = init?.timeoutMs ?? 12_000;

  // 1) 업스트림 URL 구성 (+ 쿼리스트링 전파)
  const url = new URL(`${BASE}${upstreamPath}`);
  const cur = new URL(req.url);
  // 현재 요청의 쿼리를 그대로 업스트림으로 전달
  cur.searchParams.forEach((v, k) => url.searchParams.append(k, v));

  // 2) 타임아웃 세팅
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // 3) 헤더 구성
  const headers: Record<string,string> = { "Content-Type": "application/json" };
if (forwardAuth) {
  let auth = req.headers.get("authorization");
  if (!auth) {
    const token = req.cookies.get("accessToken")?.value;
    if (token) auth = `Bearer ${token}`;
  }
  if (auth) headers["Authorization"] = auth;
}

  // 4) 바디 준비 (GET/DELETE는 바디 금지)
  const fetchInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
    signal: controller.signal,
  };
  if (method !== "GET" && method !== "DELETE") {
    if ("bodyJSON" in (init ?? {})) {
      fetchInit.body = JSON.stringify(init?.bodyJSON ?? {});
    } else {
      // 원 요청이 JSON이면 그대로 전달
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        try {
          const json = await req.json();
          fetchInit.body = JSON.stringify(json ?? {});
        } catch {
          // body 없는 경우 허용
        }
      }
    }
  }

  try {
    const upstream = await fetch(url.toString(), fetchInit);
    clearTimeout(timer);

    // 원문을 문자열로 먼저 획득 (json 파싱 실패 방지)
    const ct = upstream.headers.get("content-type") ?? "";
    const raw = await upstream.text();
    const isJSON = ct.includes("application/json");

    // dev/preview 에서는 디버그 정보 포함, prod에서는 순수 바디만
    if (process.env.NODE_ENV !== "production") {
      const parsed = isJSON ? (raw ? JSON.parse(raw) : {}) : { message: raw };
      return NextResponse.json(
        { upstream: { url: url.toString(), status: upstream.status }, body: parsed },
        { status: upstream.status }
      );
    }

    // prod: content-type이 json이 아니어도 json으로 감싸 반환 (프론트가 항상 .json() 가능)
    if (isJSON) {
      const parsed = raw ? JSON.parse(raw) : {};
      return NextResponse.json(parsed, { status: upstream.status });
    } else {
      return NextResponse.json({ message: raw }, { status: upstream.status });
    }
  } catch (e: any) {
    clearTimeout(timer);
    // 네트워크/타임아웃/ENV 문제만 500
    const payload =
      process.env.NODE_ENV !== "production"
        ? { message: "Upstream request failed", detail: String(e?.message ?? e), url: `${BASE}${upstreamPath}` }
        : { message: "Internal Server Error" };
    return NextResponse.json(payload, { status: 500 });
  }
}