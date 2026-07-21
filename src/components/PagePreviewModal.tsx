"use client";

import { useEffect, useRef, useState } from "react";

// Shows the document as real, on-screen paginated A4 sheets — answering
// "what comes on this page vs. the next" without needing to actually
// export a PDF to find out (every earlier pagination bug this session was
// only discoverable after export, since browsers don't paginate on-screen
// HTML live — @media print / page-break CSS only applies during an actual
// print/PDF action). Uses Paged.js (a CSS Paged Media polyfill) to chunk
// the exact same print-view markup + stylesheets used for the real export
// into page-shaped boxes, so what's shown here matches the real PDF.
//
// Loaded as a plain <script> tag from public/vendor/paged.min.js (global
// `window.PagedModule`), NOT via `import("pagedjs")` — that raw package
// entry pulls in an old ES5 polyfill chain that crashes under Turbopack's
// bundling ("contains.call is not a function" inside initializeHandlers).
// The vendored file is Paged.js's own pre-built, fully self-contained UMD
// bundle, so it sidesteps bundler module resolution entirely.
//
// Not literally live-per-keystroke: re-chunking is a real layout pass over
// the whole document (expensive for ~15 pages), so this renders on demand
// when opened, not on every edit.

interface PagedFlow {
  total: number;
}

interface PagedPreviewer {
  preview(content: string, stylesheets: (string | Record<string, string>)[], renderTo: Element): Promise<PagedFlow>;
}

declare global {
  interface Window {
    PagedModule?: { Previewer: new () => PagedPreviewer };
  }
}

function loadPagedScript(): Promise<void> {
  if (window.PagedModule) return Promise.resolve();
  const existing = document.getElementById("pagedjs-vendor-script") as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Paged.js")));
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "pagedjs-vendor-script";
    script.src = "/vendor/paged.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paged.js"));
    document.head.appendChild(script);
  });
}

interface Props {
  open: boolean;
  onClose: () => void;
  sourceSelector: string;
}

export default function PagePreviewModal({ open, onClose, sourceSelector }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [pageCount, setPageCount] = useState(0);
  const [renderNonce, setRenderNonce] = useState(0);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      setStatus("loading");
      try {
        await loadPagedScript();
      } catch (e) {
        console.error("Could not load Paged.js", e);
        if (!cancelled) setStatus("error");
        return;
      }
      if (cancelled || !window.PagedModule) return;

      const sourceEl = document.querySelector(sourceSelector);
      if (!sourceEl || !containerRef.current) {
        setStatus("error");
        return;
      }
      containerRef.current.innerHTML = "";

      // Deliberately NOT the live page's compiled stylesheets — Paged.js's
      // bundled CSS parser throws ("item doesn't belong to list") on this
      // app's :nth-of-type(6n+N) accent-cycling rules (the `An+B`
      // microsyntax), so public/print-preview.css is a manually-synced
      // copy of globals.css with those specific rules stripped. See that
      // file's header note for the regenerate command and full story.
      const stylesheets: (string | Record<string, string>)[] = ["/print-preview.css"];

      const previewer = new window.PagedModule.Previewer();
      try {
        const flow = await previewer.preview(sourceEl.innerHTML, stylesheets, containerRef.current);
        if (cancelled) return;
        setPageCount(flow.total);
        setStatus("done");
      } catch (e) {
        console.error("Page preview render failed", e);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, sourceSelector, renderNonce]);

  if (!open) return null;

  return (
    <div className="page-preview-overlay">
      <div className="page-preview-toolbar">
        <span className="page-preview-status">
          {status === "loading" && "Rendering pages…"}
          {status === "done" && `${pageCount} page${pageCount === 1 ? "" : "s"}`}
          {status === "error" && "Could not render preview — try Refresh"}
        </span>
        <button className="tbtn tbtn-ghost" onClick={() => setRenderNonce((n) => n + 1)}>
          Refresh
        </button>
        <button className="tbtn tbtn-clay" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="page-preview-scroll">
        <div ref={containerRef} className="page-preview-container" />
      </div>
    </div>
  );
}
