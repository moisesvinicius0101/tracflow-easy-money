import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM = "https://tracflow-easy-money-api.onrender.com/auth";

async function proxy(request: Request, splat: string) {
  const url = `${UPSTREAM}/${splat ?? ""}`;
  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("content-type") ?? "application/json",
    Accept: "application/json",
  };
  const auth = request.headers.get("authorization");
  if (auth) headers.Authorization = auth;

  const init: RequestInit = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.text();
    if (body) init.body = body;
  }
  const res = await fetch(url, init);
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request, params }) => proxy(request, params._splat ?? ""),
      POST: ({ request, params }) => proxy(request, params._splat ?? ""),
      PUT: ({ request, params }) => proxy(request, params._splat ?? ""),
      DELETE: ({ request, params }) => proxy(request, params._splat ?? ""),
    },
  },
});