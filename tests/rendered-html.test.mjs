import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

function executionContext() {
  return {
    waitUntil() {},
    passThroughOnException() {},
  };
}

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    executionContext(),
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders the salon affiliate links and disclosure", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("affiliate-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    executionContext(),
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /hb\.afl\.rakuten\.co\.jp\/hsc\/55f27dbe/);
  assert.match(html, /px\.a8\.net\/svt\/ejp\?a8mat=4B85P1\+CQFSKY\+3UQG\+61C2P/);
  assert.match(html, /www13\.a8\.net\/0\.gif\?a8mat=4B85P1\+CQFSKY\+3UQG\+61C2P/);
  assert.match(html, /本ページはアフィリエイト広告を利用しています/);
});

test("serves hairstyle model images when the deployed asset is missing", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("style-image-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const originalFetch = globalThis.fetch;
  let fetchedUrl = "";
  globalThis.fetch = async (input) => {
    fetchedUrl = String(input);
    return new Response(new Uint8Array([82, 73, 70, 70]), {
      status: 200,
      headers: { "content-type": "application/octet-stream" },
    });
  };

  try {
    const response = await worker.fetch(
      new Request("http://localhost/style-models/messy-mash.webp"),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      executionContext(),
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/webp");
    assert.match(response.headers.get("cache-control") ?? "", /immutable/);
    assert.match(
      fetchedUrl,
      /raw\.githubusercontent\.com\/heiogawa-create\/set-navi\/40f6841d.*\/public\/style-models\/messy-mash\.webp/,
    );
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [82, 73, 70, 70]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
