/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const STYLE_MODEL_PREFIX = "/style-models/";
const STYLE_MODEL_SOURCE =
  "https://raw.githubusercontent.com/heiogawa-create/set-navi/40f6841d75542a616eec55a4b8d4bb80a0aca552/public/style-models/";

async function serveStyleModel(request: Request, env: Env, pathname: string) {
  const assetResponse = await env.ASSETS.fetch(request);
  if (assetResponse.status !== 404) return assetResponse;

  const filename = pathname.slice(STYLE_MODEL_PREFIX.length);
  if (!/^[a-z0-9-]+\.webp$/.test(filename)) return assetResponse;

  const fallback = await fetch(`${STYLE_MODEL_SOURCE}${filename}`);
  if (!fallback.ok) return assetResponse;

  const headers = new Headers(fallback.headers);
  headers.set("content-type", "image/webp");
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(fallback.body, {
    status: 200,
    headers,
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith(STYLE_MODEL_PREFIX)) {
      return serveStyleModel(request, env, url.pathname);
    }

    if (url.pathname === "/_vinext/image") {
      if (!env.IMAGES) {
        const source = url.searchParams.get("url");
        if (source?.startsWith("/")) {
          return env.ASSETS.fetch(new Request(new URL(source, request.url)));
        }
        return new Response("Image optimization is unavailable", { status: 503 });
      }

      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
