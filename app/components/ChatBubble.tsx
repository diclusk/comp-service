"use client";

import { useEffect, useRef, useState } from "react";
import { ChatCircleDots, DotsSixVertical, X } from "@phosphor-icons/react";
import ChatBot from "./ChatBot";
import { useChatWidget } from "./ChatWidgetProvider";

const EDGE_MARGIN = 16;
const DRAG_THRESHOLD = 6;

type Pos = { x: number; y: number };
type Dock = {
  xSide: "left" | "right";
  xOffset: number;
  ySide: "top" | "bottom";
  yOffset: number;
};

export default function ChatBubble() {
  const { hasOpenedOnce, isOpen, closeChat, toggleChat } = useChatWidget();
  const containerRef = useRef<HTMLDivElement>(null);

  // Live position while actively dragging (raw px, top-left anchored).
  const [dragPos, setDragPos] = useState<Pos | null>(null);
  // Persisted anchor once the user has dropped the widget somewhere. Using
  // a side (left/right, top/bottom) instead of a fixed left/top means the
  // panel always grows AWAY from whichever edge it's docked to, so opening
  // it never pushes it off-screen — it opens toward whichever edge it's
  // docked at is the anchor, and grows into the free space on the other side.
  const [dock, setDock] = useState<Dock | null>(null);
  const [dragging, setDragging] = useState(false);

  const dragInfo = useRef<{
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
    moved: boolean;
  } | null>(null);

  const getSize = () => {
    const el = containerRef.current;
    return { w: el?.offsetWidth ?? 56, h: el?.offsetHeight ?? 56 };
  };

  const clampToViewport = (x: number, y: number) => {
    const { w, h } = getSize();
    const maxX = Math.max(window.innerWidth - w - EDGE_MARGIN, EDGE_MARGIN);
    const maxY = Math.max(window.innerHeight - h - EDGE_MARGIN, EDGE_MARGIN);
    return {
      x: Math.min(Math.max(x, EDGE_MARGIN), maxX),
      y: Math.min(Math.max(y, EDGE_MARGIN), maxY),
    };
  };

  // Decide which corner/edges to anchor to based on a top-left position:
  // horizontally it always snaps flush to the nearest edge (left or right),
  // vertically it keeps roughly where it was dropped but picks top/bottom
  // as the anchor so the panel opens into free space instead of overflowing.
  const computeDock = (x: number, y: number): Dock => {
    const { w, h } = getSize();
    const xSide: Dock["xSide"] = x + w / 2 < window.innerWidth / 2 ? "left" : "right";
    const ySide: Dock["ySide"] = y + h / 2 < window.innerHeight / 2 ? "top" : "bottom";
    const rawYOffset = ySide === "top" ? y : window.innerHeight - y - h;
    return {
      xSide,
      xOffset: EDGE_MARGIN,
      ySide,
      yOffset: Math.max(rawYOffset, EDGE_MARGIN),
    };
  };

  const handleDragStart = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    // Only respond to primary button / touch / pen.
    if (e.button !== undefined && e.button !== 0) return;

    const rect = el.getBoundingClientRect();
    dragInfo.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      moved: false,
    };
    setDragging(true);

    const handlePointerMove = (ev: PointerEvent) => {
      const info = dragInfo.current;
      if (!info) return;
      const dx = ev.clientX - info.startClientX;
      const dy = ev.clientY - info.startClientY;
      if (!info.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        info.moved = true;
      }
      if (info.moved) {
        setDragPos(clampToViewport(info.startLeft + dx, info.startTop + dy));
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      setDragging(false);

      const info = dragInfo.current;
      dragInfo.current = null;

      if (info?.moved) {
        setDragPos((current) => {
          const base = current ?? clampToViewport(info.startLeft, info.startTop);
          setDock(computeDock(base.x, base.y));
          return null;
        });
      } else {
        // No real movement happened — treat it as a click.
        toggleChat();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Keep the widget on-screen (and re-pick the correct growth direction) if
  // the viewport is resized, e.g. rotating a phone.
  useEffect(() => {
    const onResize = () => {
      const el = containerRef.current;
      if (!el || !dock) return;
      const rect = el.getBoundingClientRect();
      setDock(computeDock(rect.left, rect.top));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dock]);

  // The widget doesn't exist on the page at all until it's summoned once.
  if (!hasOpenedOnce) return null;

  let style: React.CSSProperties | undefined;
  let alignClass = "items-end";
  let directionClass = "flex-col";
  let staticCornerClass = "bottom-5 right-5";

  if (dragPos) {
    style = { left: dragPos.x, top: dragPos.y, right: "auto", bottom: "auto" };
    staticCornerClass = "";
  } else if (dock) {
    style = {
      left: dock.xSide === "left" ? dock.xOffset : "auto",
      right: dock.xSide === "right" ? dock.xOffset : "auto",
      top: dock.ySide === "top" ? dock.yOffset : "auto",
      bottom: dock.ySide === "bottom" ? dock.yOffset : "auto",
    };
    alignClass = dock.xSide === "left" ? "items-start" : "items-end";
    directionClass = dock.ySide === "top" ? "flex-col-reverse" : "flex-col";
    staticCornerClass = "";
  }

  return (
    <div
      ref={containerRef}
      style={style}
      className={`fixed z-50 flex gap-3 ${directionClass} ${alignClass} ${staticCornerClass} ${
        dragging ? "select-none" : ""
      }`}
    >
      {isOpen && (
        <div
          className="
            w-[92vw] max-w-sm h-[70vh] max-h-150
            rounded-2xl border border-white/10 bg-navy-950/95 shadow-2xl
            overflow-hidden flex flex-col backdrop-blur-xl
            transition-all duration-200 ease-out
            opacity-100 translate-y-0
          "
        >
          <div
            onPointerDown={handleDragStart}
            className="flex items-center gap-3 px-4 py-3 bg-navy-900/80 border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing touch-none"
          >
            <DotsSixVertical size={16} className="shrink-0 text-slate-500" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent)/15 text-(--accent) shrink-0">
              <ChatCircleDots size={18} weight="fill" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm tracking-wide text-white leading-tight">
                CoVS Assistant
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Biasanya balas dalam beberapa detik
              </p>
            </div>
            <button
              onClick={closeChat}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Tutup chat"
              className="ml-auto rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <ChatBot />
          </div>
        </div>
      )}

      <button
        onPointerDown={handleDragStart}
        aria-label={isOpen ? "Tutup chat" : "Buka chat"}
        className="
          w-14 h-14 rounded-full bg-navy-900 text-(--accent)
          border border-white/10 shadow-lg shadow-black/40
          hover:scale-105 active:scale-95 hover:border-(--accent)/40
          transition-all flex items-center justify-center touch-none shrink-0
        "
      >
        {isOpen ? (
          <X size={26} weight="bold" className="text-white" />
        ) : (
          <ChatCircleDots size={28} weight="fill" />
        )}
      </button>
    </div>
  );
}
