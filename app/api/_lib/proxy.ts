/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * app/api/_lib/proxy.ts
 *
 * - 로컬/배포 자동 분기 (.env.local이 .env보다 우선)
 * - Authorization 헤더/쿠키 자동 전달 (+ 로컬 ACCESS_TOKEN 주입 지원)
 * - JSON/멀티파트/바이너리 모두 지원 (업로드 스트림 패스스루)
 * - 타임아웃 + 네트워크/5xx 재시도 (지수백오프)
 * - 개발모드 디버그 래핑 응답(원하면 패스스루로 전환 가능)
 * - 에러 메시지 일관 포맷
 *
 * 사용 예시:
 *   return proxyJSON(req, "/api/users/me/profile", {
 *     method: "PATCH",
 *     forwardAuth: true,
 *   });
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const IS_PROD = process.env.NODE_ENV === "production";
const IS_DEV = !IS_PROD;

// .env.local이 .env보다 우선 적용되므로 여기서는 API_URL 하나만 읽으면 됨
const BASE = process.env.API_URL;
const PUBLIC_URL =
  process.env.PUBLIC_URL ??
  (IS_PROD ? "https://pangpang-one.vercel.app" : "http://localhost:3000");

// 백엔드가 세션/토큰을 쿠키로 운용하는 경우 필요한 키만 선별 전달
const FORWARD_COOKIE_KEYS = ["accessToken", "refreshToken", "JSESSIONID"] as const;

// 재시도 대상 상태코드
const RETRY_STATUS = new Set([502, 503, 504]);

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type CommonOpts = {
  method?: Method;
  forwardAuth?: boolean; // Authorization/Cookie 전달
  forwardCookies?: boolean; // 선택 쿠키 전달 (기본 true)
  timeoutMs?: number; // 요청 타임아웃
  retries?: number; // 재시도 횟수(기본 1)
  retryBackoffBaseMs?: number; // 백오프 기본(기본 300ms)
  devPassthrough?: boolean; // 개발모드에서도 원본 그대로 반환
  extraHeaders?: Record<string, string>; // 추가로 강제할 헤더
};

type JSONOpts = CommonOpts & {
  bodyJSON?: any; // 명시적 JSON 바디
};

type StreamOpts = CommonOpts & {
  // 스트림 패스스루 전용 옵션 (JSON 바디 X)
};

function assertBase() {
  if (!BASE || !/^https?:\/\//.test(BASE)) {
    return NextResponse.json(
      { message: "API_URL is missing or invalid (e.g. http://host:port)" },
      { status: 500 }
    );
  }
  return null;
}

function buildUpstreamURL(req: NextRequest, upstreamPath: string): URL {
  const url = new URL(`${BASE}${upstreamPath}`);
  const cur = new URL(req.url);
  // 쿼리스트링 전달
  cur.searchParams.forEach((v, k) => url.searchParams.append(k, v));
  return url;
}

function resolveAuthHeader(req: NextRequest): string | undefined {
  // 1) 요청 헤더 우선
  let auth = req.headers.get("authorization") || undefined;

  // 2) 로컬에서 ACCESS_TOKEN 환경변수 주입(편의)
  if (!auth && IS_DEV) {
    const token = process.env.ACCESS_TOKEN;
    if (token) auth = `Bearer ${token}`;
  }

  // 3) 쿠키에서 accessToken → Bearer
  if (!auth) {
    const token = req.cookies.get("accessToken")?.value;
    if (token) auth = `Bearer ${token}`;
  }
  return auth;
}

function pickCookies(req: NextRequest): string | undefined {
  const parts: string[] = [];
  for (const key of FORWARD_COOKIE_KEYS) {
    const v = req.cookies.get(key)?.value;
    if (v) parts.push(`${key}=${v}`);
  }
  return parts.length ? parts.join("; ") : undefined;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries: number,
  backoffBase: number
): Promise<Response> {
  let attempt = 0;
  // NOTE: init.body가 ReadableStream/Buffer일 경우 재사용 불가.
  // JSON 문자열/Uint8Array라면 재시도에 안전.
  // 스트림 업로드(멀티파트) 재시도는 위험하므로 retries=0 권장.
  while (true) {
    try {
      const res = await fetch(url, init);
      if (retries > 0 && RETRY_STATUS.has(res.status)) {
        if (attempt < retries) {
          attempt++;
          const delay = backoffBase * Math.pow(2, attempt - 1);
          await sleep(delay);
          continue;
        }
      }
      return res;
    } catch (e) {
      if (attempt < retries) {
        attempt++;
        const delay = backoffBase * Math.pow(2, attempt - 1);
        await sleep(delay);
        continue;
      }
      throw e;
    }
  }
}

/**
 * JSON 중심 프록시: application/json 바디 처리 + 업스트림 JSON 응답 파싱
 * (그 외 content-type 응답도 안전하게 처리)
 */
export async function proxyJSON(
  req: NextRequest,
  upstreamPath: string,
  opts?: JSONOpts
) {
  const envError = assertBase();
  if (envError) return envError;

  const method: Method = opts?.method ?? "GET";
  const forwardAuth = opts?.forwardAuth ?? false;
  const forwardCookies = opts?.forwardCookies ?? true;
  const timeoutMs = opts?.timeoutMs ?? 12_000;
  const retries = opts?.retries ?? 1;
  const backoffBase = opts?.retryBackoffBaseMs ?? 300;
  const devPassthrough = opts?.devPassthrough ?? false;

  const url = buildUpstreamURL(req, upstreamPath);

  // 타임아웃 컨트롤러
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // 업스트림 헤더 구성
  const headers = new Headers({
    Accept: "application/json, */*;q=0.8",
    Origin: PUBLIC_URL, // 일부 백엔드 CORS 우회용(서버-서버지만 검사하는 경우 존재)
    ...(opts?.extraHeaders ?? {}),
  });

  // Content-Type은 JSON 바디를 보낼 때만 붙임 (스트림 업로드와 충돌 방지)
  let upstreamBody: RequestInit["body"] | undefined;

  if (method !== "GET" && method !== "DELETE") {
    if (Object.prototype.hasOwnProperty.call(opts ?? {}, "bodyJSON")) {
      headers.set("Content-Type", "application/json");
      upstreamBody = JSON.stringify(opts?.bodyJSON ?? {});
    } else {
      // 클라이언트가 보낸 바디를 그대로 사용
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        headers.set("Content-Type", "application/json");
        try {
          const json = await req.json();
          upstreamBody = JSON.stringify(json ?? {});
        } catch {
          upstreamBody = JSON.stringify({});
        }
      } else if (ct) {
        // multipart/form-data, application/x-www-form-urlencoded, 기타 바이너리
        // -> Content-Type/Length 그대로 전달 + 바디 스트림 패스스루
        headers.set("Content-Type", ct);
        const len = req.headers.get("content-length");
        if (len) headers.set("Content-Length", len);
        upstreamBody = req.body as any; // ReadableStream 패스스루
      }
    }
  }

  if (forwardAuth) {
    const auth = resolveAuthHeader(req);
    if (auth) headers.set("Authorization", auth);
  }
  if (forwardCookies) {
    const cookie = pickCookies(req);
    if (cookie) headers.set("Cookie", cookie);
  }

  // 프록시 요청 옵션
  const fetchInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
    signal: controller.signal,
    body: upstreamBody,
    // keepalive: true, // 필요시 사용
  };

  try {
    const upstream = await fetchWithRetry(url.toString(), fetchInit, upstreamBody ? 0 : retries, backoffBase);
    clearTimeout(timer);

    // 응답 처리
    const resCT = upstream.headers.get("content-type") ?? "";
    const status = upstream.status;

    // 개발모드 디버깅: 래핑 형태로 응답
    if (IS_DEV && !devPassthrough) {
      const raw = await upstream.text();
      if (resCT.includes("application/json")) {
        const parsed = raw ? safeJSONParse(raw) : {};
        return NextResponse.json(
          { upstream: { url: url.toString(), status }, body: parsed },
          { status }
        );
      }
      // JSON이 아니면 메시지로 감싸서 반환
      return NextResponse.json(
        { upstream: { url: url.toString(), status }, body: { message: raw } },
        { status }
      );
    }

    // 프로덕션(또는 devPassthrough=true): 가능한 원본 형태 유지
    if (resCT.includes("application/json")) {
      const raw = await upstream.text();
      const parsed = raw ? safeJSONParse(raw) : {};
      return NextResponse.json(parsed, { status });
    }

    // JSON 이외(파일/텍스트 등) — 헤더 일부만 골라서 전달
    const passHeaders = new Headers();
    if (resCT) passHeaders.set("content-type", resCT);
    const cl = upstream.headers.get("content-length");
    if (cl) passHeaders.set("content-length", cl);
    const disp = upstream.headers.get("content-disposition");
    if (disp) passHeaders.set("content-disposition", disp);

    // 바디 스트림 그대로 반환(메모리 절약)
    return new Response(upstream.body, { status, headers: passHeaders });
  } catch (e: any) {
    clearTimeout(timer);
    const payload = IS_DEV
      ? {
          message: "Upstream request failed",
          detail: String(e?.message ?? e),
          url: `${BASE}${upstreamPath}`,
        }
      : { message: "Internal Server Error" };
    return NextResponse.json(payload, { status: 500 });
  }
}

/**
 * 업로드/다운로드 등 스트림 패스스루가 핵심일 때 사용하는 프록시
 * (JSON 파싱/래핑 없이 최대한 원본 보존)
 */
export async function proxyStream(
  req: NextRequest,
  upstreamPath: string,
  opts?: StreamOpts
) {
  const envError = assertBase();
  if (envError) return envError;

  const method: Method = opts?.method ?? "GET";
  const forwardAuth = opts?.forwardAuth ?? false;
  const forwardCookies = opts?.forwardCookies ?? true;
  const timeoutMs = opts?.timeoutMs ?? 60_000; // 업로드는 넉넉히
  const retries = opts?.retries ?? 0; // 스트림은 재시도 비권장
  const backoffBase = opts?.retryBackoffBaseMs ?? 300;

  const url = buildUpstreamURL(req, upstreamPath);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers({
    Accept: req.headers.get("accept") ?? "*/*",
    Origin: PUBLIC_URL,
    ...(opts?.extraHeaders ?? {}),
  });

  // 원본 Content-* 헤더를 최대한 그대로 전달
  const ct = req.headers.get("content-type");
  if (ct) headers.set("Content-Type", ct);
  const cl = req.headers.get("content-length");
  if (cl) headers.set("Content-Length", cl);

  if (forwardAuth) {
    const auth = resolveAuthHeader(req);
    if (auth) headers.set("Authorization", auth);
  }
  if (forwardCookies) {
    const cookie = pickCookies(req);
    if (cookie) headers.set("Cookie", cookie);
  }

  const fetchInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
    signal: controller.signal,
    body: method !== "GET" && method !== "DELETE" ? (req.body as any) : undefined,
    duplex: "half", // Node18 스트림 업로드 안정화
  } as RequestInit;

  try {
    const upstream = await fetchWithRetry(url.toString(), fetchInit, retries, backoffBase);
    clearTimeout(timer);

    // 응답 헤더 일부를 그대로 전달
    const resHeaders = new Headers();
    const resCT = upstream.headers.get("content-type");
    if (resCT) resHeaders.set("content-type", resCT);
    const resCL = upstream.headers.get("content-length");
    if (resCL) resHeaders.set("content-length", resCL);
    const disp = upstream.headers.get("content-disposition");
    if (disp) resHeaders.set("content-disposition", disp);

    return new Response(upstream.body, { status: upstream.status, headers: resHeaders });
  } catch (e: any) {
    clearTimeout(timer);
    const payload = IS_DEV
      ? {
          message: "Upstream stream failed",
          detail: String(e?.message ?? e),
          url: `${BASE}${upstreamPath}`,
        }
      : { message: "Internal Server Error" };
    return NextResponse.json(payload, { status: 500 });
  }
}

/** 안전 JSON 파서 */
function safeJSONParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}


