/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/_lib/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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
  upstreamPath: string,
  init?: RequestInit & {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    forwardAuth?: boolean;
    timeoutMs?: number;
    bodyJSON?: any;
  }
) {
  const envError = assertBase();
  if (envError) return envError;

  const method = init?.method ?? "GET";
  const forwardAuth = init?.forwardAuth ?? false;
  const timeoutMs = init?.timeoutMs ?? 12_000;

  const url = new URL(`${BASE}${upstreamPath}`);
  const cur = new URL(req.url);
  cur.searchParams.forEach((v, k) => url.searchParams.append(k, v));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (forwardAuth) {
    let auth = req.headers.get("authorization");

    // 로컬이면 ACCESS_TOKEN 환경변수에서 주입
    if (!auth && process.env.NODE_ENV === "development") {
      const token = process.env.ACCESS_TOKEN;
      if (token) auth = `Bearer ${token}`;
    }

    // 운영 환경에서는 쿠키에서 주입
    if (!auth) {
      const token = req.cookies.get("accessToken")?.value;
      if (token) auth = `Bearer ${token}`;
    }

    if (auth) headers["Authorization"] = auth;
  }

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
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        try {
          const json = await req.json();
          fetchInit.body = JSON.stringify(json ?? {});
        } catch {}
      }
    }
  }

  try {
    const upstream = await fetch(url.toString(), fetchInit);
    clearTimeout(timer);

    const ct = upstream.headers.get("content-type") ?? "";
    const raw = await upstream.text();
    const isJSON = ct.includes("application/json");

    if (process.env.NODE_ENV !== "production") {
      const parsed = isJSON ? (raw ? JSON.parse(raw) : {}) : { message: raw };
      return NextResponse.json(
        { upstream: { url: url.toString(), status: upstream.status }, body: parsed },
        { status: upstream.status }
      );
    }

    if (isJSON) {
      const parsed = raw ? JSON.parse(raw) : {};
      return NextResponse.json(parsed, { status: upstream.status });
    } else {
      return NextResponse.json({ message: raw }, { status: upstream.status });
    }
  } catch (e: any) {
    clearTimeout(timer);
    const payload =
      process.env.NODE_ENV !== "production"
        ? { message: "Upstream request failed", detail: String(e?.message ?? e), url: `${BASE}${upstreamPath}` }
        : { message: "Internal Server Error" };
    return NextResponse.json(payload, { status: 500 });
  }
}
