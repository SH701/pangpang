/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.API_URL;
const PUBLIC_URL = process.env.PUBLIC_URL ?? "https://pangpang-one.vercel.app";

const FORWARD_COOKIE_KEYS = [
  "accessToken",
  "refreshToken",
  "JSESSIONID",
] as const;
const RETRY_STATUS = new Set([502, 503, 504]);

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type CommonOpts = {
  method?: Method;
  forwardAuth?: boolean;
  forwardCookies?: boolean;
  timeoutMs?: number;
  retries?: number;
  retryBackoffBaseMs?: number;
  extraHeaders?: Record<string, string>;
};

type JSONOpts = CommonOpts & {
  bodyJSON?: any;
};

function assertBase() {
  if (!BASE || !/^https?:\/\//.test(BASE)) {
    return NextResponse.json(
      { message: "API_URL is missing or invalid" },
      { status: 500 }
    );
  }
  return null;
}

function buildUpstreamURL(req: NextRequest, upstreamPath: string): URL {
  const url = new URL(`${BASE}${upstreamPath}`);
  const cur = new URL(req.url);
  cur.searchParams.forEach((v, k) => url.searchParams.append(k, v));
  return url;
}

function resolveAuthHeader(req: NextRequest): string | undefined {
  let auth = req.headers.get("authorization") || undefined;
  if (!auth) {
    const token = req.cookies.get("accessToken")?.value;
    if (token && token !== "null") auth = `Bearer ${token}`;
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
  while (true) {
    try {
      const res = await fetch(url, init);
      if (retries > 0 && RETRY_STATUS.has(res.status) && attempt < retries) {
        attempt++;
        const delay = backoffBase * Math.pow(2, attempt - 1);
        await sleep(delay);
        continue;
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

  const url = buildUpstreamURL(req, upstreamPath);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers({
    Accept: "application/json, */*;q=0.8",
    Origin: PUBLIC_URL,
    ...(opts?.extraHeaders ?? {}),
  });

  let upstreamBody: RequestInit["body"] | undefined;

  if (method !== "GET" && method !== "DELETE") {
    if (Object.prototype.hasOwnProperty.call(opts ?? {}, "bodyJSON")) {
      headers.set("Content-Type", "application/json");
      upstreamBody = JSON.stringify(opts?.bodyJSON ?? {});
    } else {
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        headers.set("Content-Type", "application/json");
        try {
          const text = await req.text(); // body를 raw string으로 받음
          upstreamBody = text.length > 0 ? text : undefined; // 비어 있으면 undefined
        } catch {
          upstreamBody = undefined; // body 없으면 아예 안 붙임
        }
      } else if (ct) {
        headers.set("Content-Type", ct);
        const len = req.headers.get("content-length");
        if (len) headers.set("Content-Length", len);
        upstreamBody = req.body as any;
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

  const fetchInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
    signal: controller.signal,
    body: upstreamBody,
  };

  try {
    const upstream = await fetchWithRetry(
      url.toString(),
      fetchInit,
      upstreamBody ? 0 : retries,
      backoffBase
    );
    clearTimeout(timer);

    const resCT = upstream.headers.get("content-type") ?? "";
    const status = upstream.status;

    if (resCT.includes("application/json")) {
      const raw = await upstream.text();
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        return NextResponse.json(parsed, { status });
      } catch {
        return new Response(raw, {
          status,
          headers: { "content-type": "text/plain" },
        });
      }
    }

    const passHeaders = new Headers();
    if (resCT) passHeaders.set("content-type", resCT);
    const cl = upstream.headers.get("content-length");
    if (cl) passHeaders.set("content-length", cl);
    const disp = upstream.headers.get("content-disposition");
    if (disp) passHeaders.set("content-disposition", disp);

    return new Response(upstream.body, { status, headers: passHeaders });
  } catch (e: any) {
    clearTimeout(timer);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
